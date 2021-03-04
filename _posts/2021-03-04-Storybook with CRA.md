---
layout: post

title: Storybook with CRA

date: 2021-03-04

modified: 2021-03-04

category: React

tags: [React, Storybook, Webpack, CRA, Tip]

Author: DDK0301
---

스토리북 세팅을 3번이나 해봤지만, 매번 어려웠던 것 같다. 물론 나만 겪은 일이 아니고 주변 사람들에게 스토리북이 어려운 이유를 물어봤을 때, 모두 스토리북 세팅이 어렵다고 이야기했었다. 그동안 해왔던 삽질을 써놓는 것으로 도움이 됐으면 좋겠다는 취지로 글을 쓰기로 하였다. 또한 이번 스토리북이 6.x버전이 넘어가면서 자동으로 세팅을 도와주니 세팅에 대한 어려움이 많이 줄었다. 

## What is Storybook?

> Storybook은 UI 개발을위한 도구입니다. 구성 요소를 분리하여 개발을 더 빠르고 쉽게 만듭니다. 이렇게하면 한 번에 하나의 구성 요소에서 작업 할 수 있습니다. 복잡한 개발 스택을 시작하거나 특정 데이터를 데이터베이스로 강제 실행하거나 애플리케이션을 탐색 할 필요없이 전체 UI를 개발할 수 있습니다.

스토리북의 가장 큰 장점은 **컴포넌트별로 UI를 확인 할 수 있다는 것**이다. 이러한 특징은 MT* 패턴의 장점을 극대화 한다. 기존 개발에서 컴포넌트를 만들고 재사용할 때, 각각의 컴포넌트가 어떻게 작동하는지 알기 어려웠다. 하지만 스토리북을 이용하면 **컴포넌트가 어떻게 작동하는지 예측**할 수 있다. 더 나아가 스토리북을 사용하여 디자인 시스템을 구축하면 디자이너가 컴포넌트별로 확인하기 쉬워진다. 

## How to use Storybook?

최소한의 노력만 해서 Storybook을 사용해보자

### Setup

우선 CRA를 이용해서 Storybook을 사용하게 될 React 환경을 생성하자.

```bash
$ npx create-react-app storybook-test
```

놀랍게도 스토리북을 사용하기 위한 준비를 반절이 끝났다.

마지막으로 Storybook을 프로젝트에 설치하면 모든 준비가 끝나게 된다.

```bash
$ npx sb init
```

설치가 완료되었으면 `yarn storybook`으로 Storybook을 실행시켜보자.

![Storybook_with_CRA_01](https://drive.google.com/uc?id=1mwhbLiceOYPW40S7lNel99x5UILfX3WS)

스토리북의 세팅이 끝났다. 6.x 버전이 넘어가면서 자동으로 프로젝트 프레임워크를 확인하고 자동 세팅하는 기능 때문에 Storybook 사용을 쉽게 할 수 있다. 이렇게 봐서는 스토리북의 사용이 쉬워 보일 수 있다. 하지만 모듈을 추가했을 때, 모듈 충돌이 빈번히 일어나고 문서가 적어서 발생하는 삽질 때문에 세팅에 어려움을 겪는 일이 많다.

### Use

스토리북을 설치하면 **stories**와 **.storybook** 이름으로 폴더가 생성된다. **.storybook** 폴더는 Storybook의 설정 관련 코드가 생성되어있다.  **stories** 폴더에는 Storybook의 예시 코드가 생성된다. 이번 글에서는 예시 코드로 제공된 **Button** 컴포넌트로 사용 방법을 익히고 설정 관련 코드는 다음 글에서 더 자세하게 다룰 예정이다.

`Button.js`의 코드를 보면 이상한 주석이 달린 것을 볼 수가 있다. `/** */` 형태의 주석은 Storybook에서 인식하여 Docs에서 사용되게 된다.

```js
/* stories/Button.js */ 

import React from "react";
import PropTypes from "prop-types";
import "./button.css";

// 👇 Button 컴포넌트의 Docs에서의 설명 부분
/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, size, label, ...props }) => {
  ...
};

// 👇 Button 컴포넌트의 Docs에서의 프로퍼티 설명 부분
Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(["small", "medium", "large"]),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: "medium",
  onClick: undefined,
};
```

Storybook으로 돌아가서 Docs를 확인하면 다음과 같이 설명이 있는 것을 확인 할 수가 있다. 또한 Props를 인식하고 Storybook에 등록되는 것을 확인 할 수 있다.

![Storybook_with_CRA_03](https://drive.google.com/uc?id=1ApmE3YD4mpj27Ie7ou0SKvz-Ul300Sjy)

다음은 Storybook을 사용하기 위해 작성된 코드를 살펴보자.

```js
import React from "react";

import { Button } from "./Button";

// 👇 Storybook의 기본 설정
export default {
  title: "Example/Button", // 그룹 / 네이밍
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" }, // porps중 backgroundColor의 컨트롤을 color로 사용
  },
};

// 👇 Button 컴포넌트의 기본이 되는 틀 만들기
const Template = (args) => <Button {...args} />;

// 👇 Primary라는 이름으로 Storybook 만들기
export const Primary = Template.bind({});
// 👇 Primary의 속성값 정하기
Primary.args = {
  primary: true,
  label: "Button",
};

// 👇 그 밖에 만들어진 Storybook
export const Secondary = Template.bind({});
Secondary.args = {
  label: "Button",
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  label: "Button",
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  label: "Button",
};
```

Storybook 관련 코드에서 속성값을 정해줬지만 Addon을 이용하여 속성값을 변경하고 컴포넌트의 변화를 확인 할 수 있다. (Addon은 Storybook의 가장 큰 장점 중인데, 자세하게 따로 다루도록 하겠다.) 기본설정에서 따로 지정한 `backgroundColor`의 속성은 Storybook의 `color`로 컨트롤 할 수 있다.

![Storybook_with_CRA_02](https://drive.google.com/uc?id=1iVQjwPe0T004Y9en-x5X5AWAzIta9CzK)

이렇게 작성을 하므로 각각의 컴포넌트 변화를 예측하기 쉬워지고 재사용 시 스토리북에서 UI를 확인해보고 사용할 수 있다는 장점이 있다. 또한 디자이너와 기획자의 입장에서는 기대했던 결과물이 잘 작동하는지 실제로 값을 변경하면서 실제로 테스트 해볼 수 있게 된다. 협업에 있어서 좋은 툴이 맞는 것은 확실하다. ~~하지만 개발자가 코드를 더 작성해야하는 단점이 존재한다.~~

## 마무리

이번 글은 사실 Storybook을 사용하는 것보다 Storybook이 무엇인지 알아보는 글이다. 이 글을 읽어보고 Storybook에 관심이 생겼다면 앞으로 작성하게될 글을 기대해도 좋을 것 같다. 앞으로 `Storybook 설정`, `Addon`, `Scss와 함께 사용하기`, `TypeScript 설정하기`, `Redux 추가하기`등등 삽질했던 경험을 녹이며 글을 쓸 예정이다.

## 참고

https://storybook.js.org/