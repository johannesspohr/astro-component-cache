export function transform(code, id) {
  if (id.endsWith(".astro")) {
    const ast = this.parse(code);

    // find cache control export
    const cacheDefinition = ast.body.find((c) => {
      if (c.type !== "ExportNamedDeclaration") return false;
      const declaration = c.declaration;
      if (
        declaration?.type !== "VariableDeclaration" ||
        declaration.kind !== "const"
      )
        return false;
      return declaration.declarations?.[0]?.id.name === "cache";
    });

    // extract the cache export and assign it to the component factory
    if (cacheDefinition) {
      const init = cacheDefinition.declaration.declarations[0].init;
      const expDeclaration = ast.body.find(
        (c) => c.type === "ExportDefaultDeclaration"
      );
      const componentName = expDeclaration.declaration?.name;
      const variableDeclaration = ast.body.find(
        (c) =>
          c.type === "VariableDeclaration" &&
          c.declarations.some((d) => d.id?.name === componentName)
      );
      const initValue = variableDeclaration.declarations.find(
        (d) => d.id.name === componentName
      ).init;
      if (
        initValue.type === "CallExpression" &&
        initValue.arguments[0].type === "ArrowFunctionExpression"
      ) {
        return (
          "import 'astro-component-cache/register';" + // inject our little script
          code.slice(0, cacheDefinition.start) +
          code.slice(cacheDefinition.end + 1, expDeclaration.start) + // remove cache header export
          componentName +
          ".cacheControl=" +
          code.slice(init.start, init.end) +
          ";" + // set cache control on factory
          componentName +
          ".buildId='" +
          Math.random().toString(36) +
          "';" + // set build id
          code.slice(expDeclaration.start)
        ); // return output
      } else {
        console.log("Can't set cache because wrong component type");
      }
    }
  }
}
