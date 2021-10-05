import React from "react";
import { Modal, Input, Select, Row, Col } from "antd";

const { Option } = Select;

function AddModal({
  isModalVisible,
  handleOk,
  handleCancel,
  title,
  modalType,
  tiketLists,
  groupName,
  onGroupNameChange,
  selectedGroupName,
  onGroupSelect,
  groupItemContent,
  onGroupItemNameChange,
}) {
  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      maskClosable={false}
      width={750}
    >
      {modalType === "group" ? (
        <Input
          placeholder="Please enter group name"
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
          style={{ width: "400px" }}
        />
      ) : (
        <>
          <Row>
            <Col span={10}>
              <Input
                placeholder="Please enter group item name"
                value={groupItemContent}
                onChange={(e) => onGroupItemNameChange(e.target.value)}
                style={{ width: "90%" }}
              ></Input>
            </Col>
            <Col span={10}>
              <Select
                style={{ width: "90%" }}
                placeholder="Select a group"
                getPopupContainer={(node) => node.parentNode}
                value={selectedGroupName}
                onChange={(value, index) => onGroupSelect(value, index)}
              >
                {tiketLists.length > 0
                  ? tiketLists.map((item) => {
                      return (
                        <Option key={item.groupId} value={item.groupName}>
                          {item.groupName}
                        </Option>
                      );
                    })
                  : []}
              </Select>
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );
}

export default AddModal;
