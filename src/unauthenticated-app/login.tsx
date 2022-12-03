import { useAuth } from "context/auth-context";
// import React, { FormEvent } from 'react';
import { Form, Input } from "antd";
import { LongButton } from "unauthenticated-app";
import { useAsync } from "utils/use-async";
const LoginScreen = ({ onError }: { onError: (error: Error) => void }) => {
  /* 
  1、 useAuth 方法里面使用 useContext 共享了 user 、 register 、  login 、 logout 等方法,这些方法调用了 auth-provider 文件里面的 (login register logout) 方法返回一个 promise

  2、 useAsync 返回的 run 方法中传入 useAuth 返回的 login(返回一个promise) 方法,并返回一个promise，里面保存了请求成功后的数据

*/
  const { login } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await run(login(values));
    } catch (e) {
      onError(e as Error);
    }
  };
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={"username"}
        rules={[
          {
            required: true,
            message: "请输入用户名",
          },
        ]}
      >
        <Input placeholder={"用户名"} type="text" id={"username"} />
      </Form.Item>
      <Form.Item
        name={"password"}
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input placeholder={"密码"} type="password" id={"password"} />
      </Form.Item>
      <LongButton loading={isLoading} htmlType={"submit"} type={"primary"}>
        登录
      </LongButton>
    </Form>
  );
};
export default LoginScreen;
