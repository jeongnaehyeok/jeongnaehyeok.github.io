---

layout: post

title: file-loader vs url-loader

date: 2021-02-19

modified: 2021-02-19

category: Node.js

tags: [tip, study, webpack, setting]

Author: DDK0301

---

웹팩에서 파일을 다루게 되면 `file-loader`또는 `url-loader`를 대부분 사용하게 된다. 서로 비슷해 보이지만 서로 다른 두 패키지의 차이점을 알아보자.

## file-loader

> The `file-loader` resolves `import`/`require()` on a file into a url and emits the file into the output directory.

**파일을 모듈로 사용할 수 있게 만들어주는 처리**를 해준다. 즉 실제로 사용하는 파일을 `output directory`에 옮겨주는 역할을 한다.

웹팩을 사용하여 `png`파일을 사용해 보는 예제로 확인해 보자.

```jsx
// App.jsx 
...
import MyPicture from "@images/my_pictur.png";
...
```

`App`에서 `my_pictur.png`를 사용하기 위해 `import`를 해주었다. 이제 웹팩은 파일을 감지하고 `file-loader`를 사용하여 파일을 옮겨준다.

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: "file-loader",
      },
    ],
  },
  ...
}
```

확장자가 `png`파일을 만나게 되면 `file-loader`를 적용하라는 설정이다. 설정한 확장자에 해당하는 파일을 `output`설정에 해당하는 경로로 파일을 복사해준다. 이제 빌드를 하게되면 `output directory`에  `fc5ab2f04895756e0a1e365564ccc077.png`이라는 파일이 생성된다.

**즉, `file-loader`를 사용하면 사용하는 파일을` output directory`로 옮겨서 사용하게 된다.**

## url-loader

> A loader for webpack which transforms files into base64 URIs.

**파일을 base64 URL로 변환하는 처리**를 한다. 즉 파일을 옮기는 작업이아니라 변환해서 `output directory`에 저장하는 역할을 한다. 

> `url-loader` works like [`file-loader`](https://webpack.js.org/loaders/file-loader/), but can return a DataURL if the file is smaller than a byte limit.

모든 파일을 변환하는 것이 아니라 **`limit`보다 작은 파일만을 변환**하고 **그 이상의 큰 파일**은 **`file-loader`를 통해서 처리**해준다.

웹팩을 사용하여 크기가 30,000byte인 `png`파일을 사용해 보는 예제로 확인해 보자.

```jsx
// App.jsx 
...
import MyPicture from "@images/my_pictur.png";
...
```
아까와 동일하게 `my_pictur.png`을 사용했다.

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: 'url-loader',
       },
    ],
  },
  ...
}
```

최소한의 설정을 하고 빌드를 해보자. `output directory`를 아무리 찾아봐도 `png` 관련 파일이 없다. `url-loader`에서 설정한 확장자에 대한 파일을 `base64 URL`형식으로 저장을 했기 때문이다. `limit` 관련 설정하지 않았기 때문에 파일의 크기와 상관없이 모두 변환해서 저장한다.

```Js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          limit: 100,
        }
       },
    ],
  },
  ...
}
```

`limit`를 100 byte로 설정을 하고 빌드를 해보자. 파일의 크기가 `limit`를 넘었기 때문에 `file-loader`를 사용하게 된다. `output directory`를 확인하면 png 파일이 존재한다.

**즉, `url-loader`를 사용할 때 `limit`에 따라서 파일 사용이 달라진다.**

## 결론

모든 파일을 `url-loader`로 처리하게 되면 **파일 요청 횟수가 줄어든다는 장점**이 있지만, **번들의 크기가 커진다는 단점**이 생깁니다. 따라서 용량이 작거나 반복해서 사용하지 않는 이미지는 `url-loader`를 사용하는 것을 추천한다.

## 참고

[https://webpack.js.org/loaders/file-loader/](https://webpack.js.org/loaders/file-loader/)

[https://velog.io/@hyewon3938/%EC%9B%B9%ED%8C%A9-Url-loader%EC%99%80-File-loader](https://velog.io/@hyewon3938/%EC%9B%B9%ED%8C%A9-Url-loader%EC%99%80-File-loader)

[https://webpack.js.org/loaders/url-loader/](https://webpack.js.org/loaders/url-loader/)

[https://jeonghwan-kim.github.io/js/2017/05/22/webpack-file-loader.html](https://jeonghwan-kim.github.io/js/2017/05/22/webpack-file-loader.html)

