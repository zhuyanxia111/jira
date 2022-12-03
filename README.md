# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## 登录功能：

登录功能没有使用 useHttp hook 而是直接返回了 feach，然后再使用 useAsync 进行状态处理
1、 useAuth 方法里面使用 useContext 共享了 user 、 register 、 login 、 logout 等方法,这些方法调用了 auth-provider 文件里面的 (login register logout) 方法返回一个 promise

2、 调用 useAsync 返回的 run 方法中传入 useAuth 返回的 login(返回一个 promise) 方法,并返回一个 feach 请求的 promise，里面进行保存请求成功后的数据

## 搜索功能：

调用 useProjects 方法进行列表数据存储，此方法调用 useQuery(此方法返回 isLoading error 等状态，所以没有使用 useAsync 进行状态管理) 方法，

## 乐观更新逻辑：

1、在 tsx 页面通过 useProjectsQueryKey 方法获取 queryKey,调用 useEditProject 、 useAddProject 、 useDeletProject（这些方法 return 了 useMutation 方法，）等方法，里面的 useMutation 第一个参数调用了 useHttp 进行接口调用，第二个参数使用乐观更新方法

2、在调用接口前会触发 (useDeletConfig 、 useEditConfig 、 useAddConfig) 里面封装的乐观更新方法（onMutate），

3、根据 useDeletConfig 、 useEditConfig 、 useAddConfig 封装的不同增删改方法传入作为函数传入到 useConfig 里面

4、 onMutate 接收 callback ,并在里面使用 queryClient.setQueryData

5、返回 callback （增删改回调函数处理后）的值作为 setQueryData 更新的值，更新列表数据，返回未更新的列表数据作为 onError 的回滚数据（异步请求失败回滚）
