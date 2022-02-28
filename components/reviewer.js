import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons/lib/icons";
import { Button, Layout, Popover, message, Upload } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import useSWR from "swr";
import Add from './add'
import TodoList from './todolist'
import inspirecloud from "../services/inspirecloud";
import styles from "../styles/Main.module.less";
import Modal from "antd/lib/modal/Modal";
import { useState } from "react";
import { useEffect } from "react";
import Paragraph from "antd/lib/typography/Paragraph";
const token = "6b1fab0d-1662-434d-a811-4d80b3d2e6f1";
import Image from "next/image";
import Head from "next/head";


export default function Reviewer({ userInfo }) {
  console.log(userInfo);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [changeVisible, setChangeVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [avatar, setAvatar] = useState(userInfo.avatar);
  const [nickname, setNickname] = useState(
    userInfo.nickname === "" ? `用户${userInfo.phoneNumber}` : userInfo.nickname
  );
  const handleLogout = () => {
    setConfirmLoading(true);
    inspirecloud.run("logout").then((success) => {
      message.success("成功退出");
      setConfirmLoading(false);
      setLogoutVisible(false);
      location.reload();
    });
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) message.error("你只能上传HPG/PNG文件！");
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) message.error("图片必须小于10MB");
    return isJpgOrPng && isLt10M;
  };
  useEffect(() => {
    if (nickname !== userInfo.nickname) {
      inspirecloud.run("updateUserInfo", { nickname: nickname }).then((res) => {
        if (res.success) message.success("昵称修改成功");
        else message.error("昵称修改失败，请重试");
      });
    }
  }, [nickname]);
  useEffect(() => {
    if (avatar !== userInfo.avatar) {
      inspirecloud.run("updateUserInfo", { avatar: avatar }).then((res) => {
        if (res.success) message.success("头像修改成功");
        else message.error("头像修改失败，请重试");
      });
    }
  }, [avatar]);
  const handleUpload = (info) => {
    const file = info.file;
    const filename = file.name;
    inspirecloud.file
      .upload(filename, file, { token: token })
      .then((data) => setAvatar(data.url))
      .catch((error) => message.error("上传失败，请重试"));
  };
  return (
    <div className={styles["container"]}>
      <Head>
        <title>Reviewer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header className={styles["header"]}>
          <Popover
            placement="bottom"
            content={
              <div className={styles["center"]}>
                <p
                  onClick={() => setChangeVisible(true)}
                  className={styles["hovered"]}
                >
                  修改资料
                </p>
                <Modal
                  visible={changeVisible}
                  onOk={() => setChangeVisible(false)}
                  onCancel={() => setChangeVisible(false)}
                >
                  <div className={styles["center"]}>
                    <p>修改头像</p>
                    <div>
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={handleUpload}
                        beforeUpload={beforeUpload}
                      >
                        <Avatar
                          src={avatar}
                          alt="avatar"
                          style={{ width: "100%", height: "100%" }}
                          icon={<UploadOutlined />}
                        />
                      </Upload>
                    </div>
                    <p>修改用户名</p>
                    <Paragraph editable={{ onChange: setNickname }}>
                      {nickname}
                    </Paragraph>
                  </div>
                </Modal>
                <p
                  onClick={() => setLogoutVisible(true)}
                  className={styles["hovered"]}
                >
                  退出登录
                </p>
                <Modal
                  visible={logoutVisible}
                  onOk={handleLogout}
                  confirmLoading={confirmLoading}
                  onCancel={() => setLogoutVisible(false)}
                >
                  <div className={styles["center"]}>
                    <p>是否确认退出</p>
                  </div>
                </Modal>
              </div>
            }
            title={<div className={styles["center"]}>{nickname}</div>}
            trigger="hover"
          >
            <Avatar
              src={avatar}
              alt="avatar"
              className={styles["header_avatar"]}
            />
          </Popover>
        </Header>
        <Content className={styles["main"]}>
          <Add />
          <TodoList />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Reviewer ©2022 Created by dyhes
        </Footer>
      </Layout>
    </div>
  );
}
