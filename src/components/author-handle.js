import { LogoutOutlined, SaveOutlined } from "@ant-design/icons/lib/icons";
import { Table, Space, Switch, Button, PageHeader, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROXY } from "../global-vars";

function AuthorHandle() {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);

  /**
   * Authentication checking with token
   */
  useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      await axios
        .get(`${PROXY}/user/getIdAndRole`, {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          if (res.data.isLogginIn === false) {
            localStorage.clear();
          } else {
            if (res.data.role === "AUTHOR") navigate("/create-book");
          }
        })
        .catch((err) => console.log(err));
    } else {
      navigate("/login");
    }
  }, []);

  /**
   * Get all authers
   */

  useEffect(async () => {
    await axios
      .get(`${PROXY}/user/getByRole/AUTHOR`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        //set authors to the state
        setAuthors(res.data.map((value, index) => ({ ...value, key: index })));
      })
      .catch((err) => console.log(err));
  }, []);

  /**
   *
   * @param {boolean} checked
   * @param {number} index
   *
   * onchange statement of switch
   */
  const onChange = (checked, index) => {
    setAuthors((prevState) => {
      return prevState.map((value, i) => {
        if (i === index) {
          return {
            ...value,
            level: checked ? "ACTIVE" : "INACTIVE",
          };
        } else {
          return value;
        }
      });
    });
  };

  const onsubmit = async () => {
    const activeList = [],
      inactiveList = [];

    /**
     * This mapping use to push active and inactive value ids to array
     */
    authors.map((value) => {
      value.level === "ACTIVE"
        ? activeList.push(value._id)
        : inactiveList.push(value._id);
    });

    if (activeList.length !== 0) {
      //active list save
      await axios
        .put(
          `${PROXY}/user/status-update`,
          {
            ids: activeList,
            level: "ACTIVE",
          },
          {
            headers: { "x-access-token": localStorage.getItem("token") },
          }
        )
        .then((res) => {
          if (res.data.isLogginIn === false) {
            notification.error({
              message: res.data.message,
              description: "Please login again",
            });
            localStorage.clear();
            navigate("/login");
          } else {
            notification.success({ message: res.data.message });
          }
        })
        .catch((err) => console.log(err));
    }

    if (inactiveList.length !== 0) {
      //inactive list save
      await axios
        .put(
          `${PROXY}/user/status-update`,
          {
            ids: inactiveList,
            level: "INACTIVE",
          },
          {
            headers: { "x-access-token": localStorage.getItem("token") },
          }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  };

  //table columns
  const column = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "level",
      key: "level",
      render: (text, data, index) => (
        <Space size={"middle"}>
          <Switch
            checked={data.level === "ACTIVE" ? true : false}
            onChange={(checked) => onChange(checked, index)}
          />
        </Space>
      ),
    },
  ];

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        // onBack={() => navigate("/login")}
        title="Handle Authors"
        extra={[
          <Button type="danger" icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>,
        ]}
      />
      <div className="main">
        <Table columns={column} dataSource={authors || []} pagination={false} />
        <Button onClick={onsubmit} icon={<SaveOutlined />} type="primary">
          Save
        </Button>
      </div>
    </div>
  );
}

export default AuthorHandle;
