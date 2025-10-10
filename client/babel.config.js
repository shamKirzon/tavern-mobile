module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // or 'module:metro-react-native-babel-preset' for pure RN
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          allowUndefined: false,
        },
      ],
    ],
  };
};
