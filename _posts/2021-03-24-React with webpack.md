---
layout: post

title: webpack에 React 그리기

date: 2021-03-24

modified: 2021-03-24

category: React

tags: [react, webpack, tip, setting]

Author: DDK0301
---

CRA로 프로젝트를 만드는 것은 정말 편리하다. 하지만 사용하지 않는 모듈이 너무 많아 프로젝트가 무거워지는 단점이있다. 결국 서비스를 위해서 webpack을 이용해 설정을 해야하는 것은 필수이다. 이 글은 CRA에서 webpack으로 넘어가는 React 유저에게 도움을 주고자 글을 쓰게 되었다. 

## ❗️주의❗️

>  이글은 webpack을 설명하는 글이 아닙니다. webpack을 공부하시기에는 적합하지 않습니다.

글을 쓰는 시점(21.03.24)을 기준으로 정상적으로 작동하는 설정입니다. 혹시 아래의 예시를 따라 하다가 오류가 발생하면 이메일(cnh0301@gmail.com) 또는 댓글로 남겨주시면 확인하고 반영하겠습니다. 🙇🏻

## 미리보기

완성된 코드는 [여기](https://github.com/jeongnaehyeok/react-webpack-setting)에서 볼 수 있다.  
프로젝트 설정은 다음과 같이 진행될예정이다. 필요한 부분만 사용하는 것을 추천한다.

- webpack에 React 그리기
- Sass 설정
- testing-library 설정
- Storybook 설정
- React를 위한 추가적인 설정
- Todo 만들기

## 준비하기

기본적으로 **Node.js**와 **Package manager(npm or yarn)**가 설치되어 있어야한다. 이글에서는 **yarn**을 사용할 예정 이고 **npm**를 사용하는 유저들은 `yarn add` 대신에 `npm install`을 사용하면된다. 

이글에서는 다음과 같은 버전으로 설정을 진행했다.

- Node.js v14.16.0
- Yarn v1.22.4
- webpack v5.21.2

## 틀 만들기

webpack의 기본 설정과 디렉터리 구조를 만드는 작업이다.

### Node.js

우선 프로젝트를 폴더를 만들어주고 필요한 파일을 생성해 주는 작업을 해주도록 한다.

```bash
$ mkdir react-webpack-setting && cd react-webpack-setting
$ yarn init -y
```

다음과 같은 파일이 생성되었다면 **Node.js**를 사용하는 프로젝트 준비가 끝났다.

```json
// package.json

{
  "name": "react-webpack-setting",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

### Babel

모든 브라우저가 **ES6** 이상의 문법을 모두 적용하지 않았기 때문에 **ES5** 이전의 문법으로 컴파일해 주는 작업이 필요하다. 그 작업을 해주는 게 바로 **Babel**이다.

```bash
$ yarn add -D @babel/core @babel/preset-env @babel/preset-react
```
- @babel/core : Babel을 사용하기 위한 베이스
- @babel/preset-env : ES6 문법을 지원하는 플러그인을 모아둔 패키지
- @babel/preset-react : React 문법을 지원하는 플러그인을 모아둔 패키지

프로젝트의 Root에 해당 파일을 만들고 입려해주면 Babel 설정이 끝난다.

```javascript
// .babelrc

{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

### 파일 구조

가장 기본이 되는 폴더와 파일을 생성해주자. 그리고 **React**도 설치해주자.

```bash
$ yarn add react react-dom
$ mkdir src public
```

```html
<!-- public/index.html -->

<!DOCTYPE html> 
<html lang="ko"> 
  <head> 
    <meta charset="UTF-8"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>webpack에 React 그리기</title> 
  </head> 
  <body> 
    <noscript>스크립트가 작동되지 않습니다!</noscript>
    <div id="root"></div>
  </body>
</html>
```

```jsx
// src/index.jsx

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

```jsx
// src/App.jsx

import React from "react";

function App() {
  return (
    <div className="app">
      <h1>webpack에 React 그리기</h1>
    </div>
  );
}

export default App;
```

CRA에서 많이 봤던 파일들이 생성이 되었다. 이제 본격적으로 webpack 설정을 해보도록하자.

### ESLint & Prettier

> 코드 통일성과 협업을 수월하게 하기위해 추가하는 부분입니다. 선택적으로 설정해도 됩니다. 이 부분은 [VS code](https://code.visualstudio.com/)를 필요로 합니다.

#### ESLint

코드에서 발견 된 문제 패턴을 식별하고 개발자에게 알려주는 역할을 한다. 즉 코딩 스타일 가이드에 벗어난 개발을 하면 오류로 감지하고 개발자에게 알려준다. 이글에서는 [airbnb](https://github.com/airbnb/javascript) 가이드를 사용하도록 하겠다.

```bash
$ yarn add -D babel-eslint
$ npx install-peerdeps --dev eslint-config-airbnb
```

```javascript
// .eslintrc.js

module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: ['airbnb', 'airbnb/hooks', 'eslint:recommended'],
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
  },
};
```

#### Prettier

코드를 세부적인 설정에 따라 자동으로 정리하는 역할을 한다.

```bash
$ yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

- eslint-config-prettier : ESLint의 포맷팅을 비활성화 시킨다.

- eslint-plugin-prettier : 포맷팅 규칙을 Prettier를 사용해서 추가시킨다.

```javascript
// .prettierrc.js

module.exports = {
  // 문자열은 홀따옴표(')
  singleQuote: true,
  //코드 마지막에 세미콜른
  semi: true,
  //탭의 사용을 금하고 스페이스바 사용으로 대체
  useTabs: false,
  // 들여쓰기 너비는 2칸
  tabWidth: 2,
  // 객체나 배열을 작성 할 때, 원소 혹은 key-valueㅇ의 맨 뒤에 있는 것에 쉼표
  trailingComma: 'all',
  // 코드 한줄이 maximum 80칸
  printWidth: 80,
  // 화살표 함수가 하나의 매개변수를 받을 때 괄호를 생략
  arrowParens: 'avoid',
};
```

Prettier가 추가됬으니 ESLint와 충돌을 막기위에 `.eslintrc.js`에 추가로 설정한다. **extends는 순서대로 넣어야 한다.**

```javascript
// .eslintrc.js

module.exports = {
  // ...
  extends: ['airbnb', 'airbnb/hooks', 'eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    // ...
    'prettier/prettier': ['error'],
  },
};
```

#### VS Code에서 설정

**VS Code 마켓 플레이스**에서 **ESLint**와 **Prettier**를 설치한다.

<center><img src="https://drive.google.com/uc?id=1-K2jyDoGLe5ITKK52iaUxAtC-jkiOibR" width="500px" height="100%"></center>

<center><img src="https://drive.google.com/uc?id=1gIEdWlMuA1_Mv3xFPuKwzEszP3YOGCxF" width="500px" height="100%"></center>

설정의 `settings.json` 파일에 해당 내용을 추가하도록 한다.

<center><img src="https://drive.google.com/uc?id=1maTB_bG86oe59UoIbeRW0vaavDVfZV4t" width="700px" height="100%"></center>

```json
// setting.json

{
  // ...
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.alwaysShowStatus": true,
  "prettier.disableLanguages": ["js"],
  "files.autoSave": "onFocusChange",
}
```

## webpack 시작하기

본격적으로 webpack을 시작해보자. 

### webpack 설치

```bash
$ yarn add webpack webpack-cli webpack-dev-server -D
```

- webpack : webpack을 담고있는 패키지
- webpack-cli : webpack을 커맨드를 실행할 수 있게 해주는 커맨드라인 도구

- webpack-dev-server : 개발 단계에서 파일 변경시 webpack을 라이브 리로딩하는 도구

webpack의 기본이되는 `webpack.config.js` 파일을 생성해주자.

```javascript
// webpack.config.js

const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname);

module.exports = {};
```

### Mode

개발 환경과 배포 환경을 나눠주는 작업이다.

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  const mode = webpackEnv.WEBPACK_SERVE ? 'development' : 'production';
  const isEnvDevelopment = mode === 'development';
  const isEnvProduction = mode === 'production';
  return {
    mode,
  };
};
```

### Entry

webpack 번들 작업할 파일을 지정해주는 작업이다.

```javascript
// webpack.config.js

// ...
const SRC_PATH = path.resolve(__dirname, 'src');

module.exports = webpackEnv => {
  // ...
  return {
    // ...
    entry: path.resolve(SRC_PATH, 'index.jsx')
  };
};
```

### Output

빌드된 결과물을 저장할 경로를 지정하는 작업이다.

```javascript
// webpack.config.js

// ...
const BUILD_PATH = path.resolve(PROJECT_ROOT, 'build');

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    output: {
      path: BUILD_PATH,
      filename: isEnvProduction
        ? 'js/[name].[contenthash:8].js'
        : 'js/bundle.js',
    },
  }
}
```

- path : 빌드된 결과물을 저장할 경로를 지정한다.
- filename : 빌드된 파일 이름을 지정한다. [여기](https://webpack.js.org/configuration/output/#template-strings)를 참고해서 필요한대로 변경하면된다.

### Loaders

webpack에는 기본적으로 .js와 .json만 이해한다.  **Loader는 사용하고 싶은 파일(확장자)을 처리하는 방법을 알려주는 작업이다.** [webpack 공식 문서](https://webpack.js.org/loaders/)에 있는 Loader를 참고하면 좋다.

Loader를 사용하기 앞서 적용하는 법을 살펴보자.

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    module: {
      rules: [ 
        {
          test: // 처리하고 싶은 확장자
          include: // 포함하는 경로
          exclude: // 포함하지 않는 경로
          use: [ // 사용하는 loader 목록, 오른쪽에서 왼쪽으로 적용된다.
            {
              loader: // 사용할 Loader
          		options: // Loader에 사용될 옵션
            },
          ],
        },
      ],
    },
  }
}
```

이글에서는 기본적인 설정만 다루고 있다. 추가적으로 필요한 설정은 해당 Loader 레퍼런스의 주소를 참고하면 된다.

#### [babel-loader](https://webpack.js.org/loaders/babel-loader/)

**Babel 설정을 사용하는 Loader이다.** 앞에서 생성한 **Babel 설정에 따라 번들작업을 진행**한다. `.js`와 `.jsx` 확장자를 처리하는 역할을 한다.

```bash
$ yarn add -D babel-loader
```

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    module: {
      rules: [
        // ...
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  }
}
```

#### [style-loader](https://webpack.js.org/loaders/style-loader/) & [css-loader](https://webpack.js.org/loaders/css-loader/)

**CSS를 적용하는 Loader이다.** **style-loader**는 `<style>` 태그를 삽입하여 **CSS를 DOM에 추가하는 역할**을 한다. **css-loader**은 **CSS를 import를 통해서 불러오는 역할**을 한다. 

```bash
$ yarn add -D style-loader css-loader
```

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    module: {
      rules: [
        // ...
        {
          test: /\.css/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  }
}
```

#### [file-loader](https://webpack.js.org/loaders/file-loader/)

파일을 불러오는 Loader이다. **파일을 모듈로 사용할 수 있게 만들어주는 처리**를 해준다. 즉 실제로 사용하는 파일을 `output directory`에 옮겨주는 역할을 한다. 이글에서는 이미지 관련 파일만 처리해주도록 해줬다.

```bash
$ yarn add -D file-loader
```

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    module: {
      rules: [
        // ...
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
  }
}
```

파일을 불러오는 모듈은 [url-loader](https://webpack.js.org/loaders/url-loader/)도 있다. 두 개를 [비교](https://velog.io/@jeongnaehyeok/file-loader-vs-url-loader)해보고 필요한 모듈을 사용하면 될 거 같다.

### Resolve 

모듈이 확인되는 방식을 변경하는 작업이다. 예로들면 경로의 별칭을 만들어 준다거나 확장명이 없는 파일을 확인하는 방식과 순서를 알려주는 작업을 한다. 

#### extensions

확장자를 처리해줄 순서를 정하고  확장자을 생략 할 수 있도록 하는 역할을 한다. webpack은 앞서 말했듯이 기본으로 `.js`와 `.josn`에 대해서 확장자가 없이 사용할 수 있게 해준다. 따라서 우리가 사용할 `.jsx`에 대해서 webpack에 알려주어야 한다.

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },
  }
}
```

### Plugins

Loader를 사용해서 파일을 읽어왔다면, Plugin은 결과물을 사용할 수 있게 변형하는 작업을 한다. 

#### [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/)

**빌드한 결과물을 HTML 파일로 생성해주는 Plugin이다.**

```javascript
// webpack.config.js

// ...
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PUBLIC_INDEX = path.resolve(PROJECT_ROOT, 'public', 'index.html');

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    plugins: [new HtmlWebpackPlugin({ template: PUBLIC_INDEX })],
  }
}
```

> 최소한의 React 프로젝트를 실행하기 위해 HtmlWebpackPlugin만 설치해도 됩니다. 앞으로 나오는 플러그인은 선택적으로 설치해도 됩니다.

#### [dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack)

**`.env`에 있는 변수를 가져오는 Plugin이다.**

```bash
$ yarn add dotenv-webpack
```

```javascript
// webpack.config.js

// ...
const Dotenv = require('dotenv-webpack');

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    plugins: [
      //... 
      new Dotenv()
    ],
  }
}
```

`process.env` 뒤에 사용하고자 하는 변수를 사용하면 빌드과정에서 해당 변수로 변환을 해준다. ex) process.env.localhost

#### [Clean plugin for webpack](https://www.npmjs.com/package/clean-webpack-plugin)

**성공적으로 다시 빌드 한 후 webpack의 output.path에있는 모든 빌드 폴더를 제거 및 정리하는 Plugin이다.**

```bash
$ yarn add -D clean-webpack-plugin
```

```javascript
// webpack.config.js

// ...
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    plugins: [
      //... 
      new CleanWebpackPlugin(),
    ],
  }
}
```

#### [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin)

**별도로 css 파일을 만들어서 빌드하는 Plugin이다.** `<style>` 태그를 만들어 css를 적용하는 style-loader를 삭제하고 mini-css-extract-plugin.loader를 적용하도록 하자.

```bash
$ yarn remove style-loader
$ yarn add -D mini-css-extract-plugin
```

```javascript
// webpack.config.js

// ...
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    module: {
      rules: [
        // ...
        {
          test: /\.css/,
          exclude: /node_modules/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    // ...
    plugins: [
      //... 
      new MiniCssExtractPlugin(),
    ],
  }
}
```

### Cache

> 이 부분은 Webpack의 성능을 향상하기 위해서 설정하는 부분으로 선택적으로 설정해도 됩니다.

생성된 webpack 모듈 및 Chunk를 캐시 하여 빌드 속도를 향상하는 설정이다. memory 옵션은 webpack에 캐시를 메모리에 저장하도록 하고 추가 구성을 허용하지 않게 한다.

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    cache: {
      type: isEnvDevelopment ? 'memory' : 'filesystem',
    },
  }
}
```

### DevServer

개발하기 위한 개발 서버 설정이다. 개발 서버 작동하기 위해서는 앞에서 설치한 `webpack-dev-server`을 사용하면 된다. 아래의 명령어를 실행해보자.

```bash
$ webpack serve
```

`http://localhost:8080/`에서 서버가 잘 작동되는 것을 볼 수가 있다. 이걸로 만족하고 사용해도 되지만, webpack에서 원하는 대로 설정할 수 있다. 

```javascript
// webpack.config.js

module.exports = webpackEnv => {
  // ...
  return{
    // ...
    devServer: {
      port: 3000, // port 설정
      host: 'localhost', // host 설정
      open: true, // 서버를 실행했을 때, 브라우저를 열어주는 여부 
      overlay: true, // 오류 발생 시, 브라우저에 전체 화면 오버레이를 표시
      stats: 'errors-warnings', // 컴파일 시 보여주는 항목 설정
    },
  }
}
```

추가적으로 설정을 원하는 경우 [여기](https://webpack.js.org/configuration/dev-server/)를 참고하면 된다.

## Package Script

마지막으로 script 부분을 설정해주면 된다. CRA에서는 `yarn start`를 하면 자동으로 개발 서버가 작동했다. 이것은 `webpack serve`를 `package script`에 설정해준 것이다. 

```json
// package.json
{
  // ...
  "scripts": {
    "start": "webpack serve",
    "build": "webpack --progress"
  },
}
```

이제 터미널에서 `yarn start`와 `yarn build`가 잘 작동되는지 확인해보자.

## 마무리

webpack을 사용해서 React 프로젝트를 시작하는 방법을 알게 되었다. 여기서는 기본적인 설정만 다뤘지만, 공식 문서와 잘 만들어진 webpack 설정을 보면서 자신만의 webpack 설정을 만들어 사용하는 것을 권장한다.

## 참고

#### ESLint

https://eslint.org/

https://velog.io/@kyusung/eslint-config-1

https://www.npmjs.com/package/eslint-plugin-react

https://velog.io/@_jouz_ryul/ESLint-Prettier-Airbnb-Style-Guide%EB%A1%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0

#### Prettier

https://baeharam.netlify.app/posts/lint/Lint-ESLint-+-Prettier-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0

#### webpack

https://webpack.js.org/

https://www.npmjs.com/package/dotenv-webpack

https://www.npmjs.com/package/clean-webpack-plugin

https://www.npmjs.com/package/mini-css-extract-plugin

https://webpack.js.org/plugins/html-webpack-plugin/
