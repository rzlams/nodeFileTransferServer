const getDirContent = readdirSync => {

  const mainFunction = source => {
    const content = readdirSync(source, { withFileTypes: true });
    const dirs = content
      .filter(path => path.isDirectory())
      .map(path => path.name);
    const files = content
      .filter(path => path.isFile())
      .map(path => path.name);

    return { dirs, files };
  }

  return mainFunction;
}


module.exports = getDirContent;
