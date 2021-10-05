import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { message, Menu, Dropdown } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AddModal from "./AddModal";
import "./Projects.scss";

const reorder = (list, startIndex, endIndex) => {
  let tempList = [...list.groupItems];
  let FinalList = [...list.groupItems];
  FinalList[startIndex] = tempList[endIndex];
  FinalList[endIndex] = tempList[startIndex];
  return FinalList;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "#fff",
  boxSshadow: "0 3px 10px rgb(0 0 0 / 0.4)",
  borderRadius: "5px",
  border: "0.3px solid #d9d9d9",

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "rgb(240, 242, 244)",
  padding: grid,
  width: 250,
  borderRadius: "5px",
  marginRight: "10px",
});

function Projects() {
  const [state, setState] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("group");
  const [groupName, setGroupNameValues] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGroupValue, setSelectedGroupValue] = useState({});
  const [groupItemContent, setGroupItemContent] = useState("");

  const onEdit = (element, eIn, item, index) => {
    console.log("onEdit", element, eIn, item, index);
  };

  const onDelete = (element, eIn, item, index) => {
    console.log("OnDelete", element, eIn, item, index);
  };

  const menu = (element, eIn, item, index) => {
    return (
      <Menu>
        <Menu.Item key="0">
          <div onClick={() => onEdit(element, eIn, item, index)}>
            Edit
            <EditOutlined style={{ marginLeft: "20px" }} />
          </div>
        </Menu.Item>
        <Menu.Item key="1">
          <div onClick={() => onDelete(element, eIn, item, index)}>
            Delete
            <DeleteOutlined style={{ marginLeft: "20px" }} />
          </div>
        </Menu.Item>
      </Menu>
    );
  };

  const handleOk = () => {
    if (modalType === "group") {
      if (groupName) {
        let newGroup = {
          groupId: uuidv4(),
          groupName: groupName,
          groupItems: [],
        };
        let tempGroupList = [...state];
        tempGroupList.push(newGroup);
        setState(tempGroupList);
        setTimeout(() => {
          message.success("Group has been created successfully.", 2);
        }, 500);
      } else {
        message.warning("Group name is empty", 2);
        return;
      }
    } else {
      if (!selectedGroupName || !groupItemContent) {
        message.warning("Group name is empty", 2);
        return;
      }
      let newGroupItem = {
        id: uuidv4(),
        content: groupItemContent,
      };
      let tempList = [...state];
      tempList.forEach((item) => {
        if (item.groupId === selectedGroupValue.key) {
          item.groupItems.push(newGroupItem);
        }
      });
      setState([...tempList]);
      setTimeout(() => {
        message.success("Ticket has been created successfully.", 2);
      }, 500);
    }
    setIsModalVisible(false);
  };

  const onGroupSelect = (value, gItem) => {
    setSelectedGroupName(value);
    setSelectedGroupValue(gItem);
  };

  const onGroupItemNameChange = (value) => {
    setGroupItemContent(value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd].groupItems = items;
      setState([...newState]);
    } else {
      const result = move(
        state[sInd].groupItems,
        state[dInd].groupItems,
        source,
        destination
      );
      const newState = [...state];
      newState[sInd].groupItems = result[sInd];
      newState[dInd].groupItems = result[dInd];
      setState([...newState]);
    }
  }

  const onAddGroup = () => {
    setModalTitle("Add Group");
    setModalType("group");
    setIsModalVisible(true);
    console.log("State", ...state);
  };

  const onAddItem = () => {
    setModalTitle("Add Group Item");
    setModalType("group-item");
    setIsModalVisible(true);
    console.log("State", ...state);
  };

  useEffect(() => {
    let dummyData = [
      {
        groupId: uuidv4(),
        groupName: "Group A",
        groupItems: [
          {
            id: uuidv4(),
            content: "Demo content1",
          },
          {
            id: uuidv4(),
            content: "Demo content2",
          },
          {
            id: uuidv4(),
            content: "Demo content3",
          },
          {
            id: uuidv4(),
            content: "Demo content4",
          },
        ],
      },
      {
        groupId: uuidv4(),
        groupName: "Group B",
        groupItems: [
          {
            id: uuidv4(),
            content: "Demo content1 X",
          },
          {
            id: uuidv4(),
            content: "Demo content Y",
          },
          {
            id: uuidv4(),
            content: "Demo content Z",
          },
          {
            id: uuidv4(),
            content: "Demo content Z1",
          },
          {
            id: uuidv4(),
            content: "Demo content Z2",
          },
        ],
      },
      {
        groupId: uuidv4(),
        groupName: "Group C",
        groupItems: [
          {
            id: uuidv4(),
            content: "Demo content AA",
          },
          {
            id: uuidv4(),
            content: "Demo content BB",
          },
          {
            id: uuidv4(),
            content: "Demo content CC",
          },
        ],
      },
    ];
    // setState([...dummyData]);
  }, []);

  const onGroupNameChange = (value) => {
    setGroupNameValues(value);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onAddGroup();
        }}
      >
        Add new group
      </button>
      <button
        type="button"
        onClick={() => {
          onAddItem();
        }}
      >
        Add new item
      </button>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state &&
            state.map((el, ind) => (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    <div className="group-heading">{el.groupName}</div>
                    {el &&
                      el.groupItems.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                {item.content}
                                <Dropdown overlay={menu(el, ind, item, index)}>
                                  <EllipsisOutlined
                                    onClick={(e) => e.preventDefault()}
                                  />
                                </Dropdown>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
        </DragDropContext>
      </div>
      <AddModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        title={modalTitle}
        modalType={modalType}
        tiketLists={state}
        groupName={groupName}
        onGroupNameChange={onGroupNameChange}
        selectedGroupName={selectedGroupName}
        groupItemContent={groupItemContent}
        onGroupSelect={onGroupSelect}
        onGroupItemNameChange={onGroupItemNameChange}
      />
    </div>
  );
}

export default Projects;
