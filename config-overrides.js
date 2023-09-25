const { injectBabelPlugin, getLoader } = require('react-app-rewired');

const fileLoaderMatcher = function (rule) {
    return rule.loader && rule.loader.indexOf(`file-loader`) != -1
}

// <* --antd组件按需引入打包--*>
module.exports = function override(config, env) {
    // babel-plugin-import
    config = injectBabelPlugin(['import', {
        libraryName: 'antd-mobile',
        //style: 'css',   
        style: true, // （必须使用less来修改antd组件的主题，因为antd组件是基于less来写的）
    }], config);
    // <* --antd组件按需引入打包--*>


    // <* --自定义antd 组件主题-- *>
    // customize theme
    config.module.rules[1].oneOf.unshift(
        {
            test: /\.less$/,
            use: [
                require.resolve('style-loader'),
                require.resolve('css-loader'),
                {
                    loader: require.resolve('postcss-loader'),
                    options: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebookincubator/create-react-app/issues/2677
                        ident: 'postcss',
                        plugins: () => [
                            require('postcss-flexbugs-fixes'),
                            autoprefixer({
                                browsers: [
                                    '>1%',
                                    'last 4 versions',
                                    'Firefox ESR',
                                    'not ie < 9', // React doesn't support IE8 anyway
                                ],
                                flexbox: 'no-2009',
                            }),
                        ],
                    },
                },
                {
                    loader: require.resolve('less-loader'),
                    options: {
                        // 主题变量，也可以使用Theme .js代替这个。  
                        modifyVars: {
                            "@brand-primary": "#1cae82", // 正常 
                            "@brand-primary-tap": "#1DA57A", // 按下
                        },
                    },
                },
            ]
        }
    );

    // css-modules
    config.module.rules[1].oneOf.unshift(
        {
            test: /\.css$/,
            exclude: /node_modules|antd-mobile\.css/,
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[local]___[hash:base64:5]'
                    },
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebookincubator/create-react-app/issues/2677
                        ident: 'postcss',
                        plugins: () => [
                            require('postcss-flexbugs-fixes'),
                            autoprefixer({
                                browsers: [
                                    '>1%',
                                    'last 4 versions',
                                    'Firefox ESR',
                                    'not ie < 9', // React doesn't support IE8 anyway
                                ],
                                flexbox: 'no-2009',
                            }),
                        ],
                    },
                },
            ]
        }
    );

    // file-loader exclude
    let l = getLoader(config.module.rules, fileLoaderMatcher);
    l.exclude.push(/\.less$/);
    // <*--自定义antd 组件主题--*>

    return config;
}
