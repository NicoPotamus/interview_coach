import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, Platform, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Line } from "react-native-svg";
import { Button, useTheme } from "react-native-paper";

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId?: string;
}

interface SkillTree {
  id: string;
  name: string;
  nodes: SkillNode[];
}

export default function SkillTreePage() {
  const theme = useTheme();

  const [trees, setTrees] = useState<SkillTree[]>([
    {
      id: "tree1",
      name: "Main Tree",
      nodes: [
        { id: "1", label: "Programming", x: 180, y: 50 },
        { id: "2", label: "Frontend", x: 80, y: 180, parentId: "1" },
        { id: "3", label: "Backend", x: 280, y: 180, parentId: "1" },
        { id: "4", label: "React", x: 30, y: 300, parentId: "2" },
        { id: "5", label: "Node.js", x: 230, y: 300, parentId: "3" },
      ],
    },
  ]);
  const [selectedTreeId, setSelectedTreeId] = useState<string>("tree1");
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [newTreeName, setNewTreeName] = useState("");
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const [showInputModal, setShowInputModal] = useState(false);
  const [inputModalTitle, setInputModalTitle] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputAction, setInputAction] = useState<(() => void) | null>(null);

  const currentTree = trees.find((tree) => tree.id === selectedTreeId);

  const startDragging = (nodeId: string) => {
    setDraggingNodeId(nodeId);
  };

  const stopDragging = () => {
    setDraggingNodeId(null);
  };

  const handleDrag = (e: any) => {
    if (!draggingNodeId || !currentTree) return;
    if (e.buttons !== 1) return;

    const boundingRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - boundingRect.left;
    const mouseY = e.clientY - boundingRect.top;

    const updatedNodes = currentTree.nodes.map((node) =>
      node.id === draggingNodeId ? { ...node, x: mouseX, y: mouseY } : node
    );

    setTrees((prevTrees) =>
      prevTrees.map((tree) =>
        tree.id === currentTree.id ? { ...tree, nodes: updatedNodes } : tree
      )
    );
  };

  const handleCanvasRightClick = (e: any) => {
    e.preventDefault();
    if (currentTree?.nodes.length === 0) {
      setInputModalTitle("Create Root Node");
      setInputAction(() => () => {
        const rootNode: SkillNode = {
          id: `node-${Date.now()}`,
          label: inputValue,
          x: 300,
          y: 100,
        };
        setTrees((prevTrees) =>
          prevTrees.map((tree) =>
            tree.id === currentTree.id
              ? { ...tree, nodes: [rootNode] }
              : tree
          )
        );
      });
      setInputValue("");
      setShowInputModal(true);
    }
  };

  const handleNodeRightClick = (e: any, node: SkillNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNode(node);
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const createNewTree = () => {
    if (!newTreeName.trim()) return;
    const newTree: SkillTree = {
      id: `tree-${Date.now()}`,
      name: newTreeName,
      nodes: [],
    };
    setTrees([...trees, newTree]);
    setSelectedTreeId(newTree.id);
    setSelectedNodes([]);
    setNewTreeName("");
  };

  const handleMenuAction = (action: string) => {
    if (!currentTree || !selectedNode) return;

    if (action === "add") {
      setInputModalTitle("Add Child Skill");
      setInputAction(() => () => {
        const newNode: SkillNode = {
          id: `node-${Date.now()}`,
          label: inputValue,
          x: selectedNode.x + 100,
          y: selectedNode.y + 100,
          parentId: selectedNode.id,
        };
        setTrees((prevTrees) =>
          prevTrees.map((tree) =>
            tree.id === currentTree.id
              ? { ...tree, nodes: [...tree.nodes, newNode] }
              : tree
          )
        );
      });
      setInputValue("");
      setShowInputModal(true);
    } else if (action === "rename") {
      setInputModalTitle("Rename Skill");
      setInputAction(() => () => {
        setTrees((prevTrees) =>
          prevTrees.map((tree) =>
            tree.id === currentTree.id
              ? {
                  ...tree,
                  nodes: tree.nodes.map((n) =>
                    n.id === selectedNode.id ? { ...n, label: inputValue } : n
                  ),
                }
              : tree
          )
        );
      });
      setInputValue(selectedNode.label);
      setShowInputModal(true);
    } else if (action === "delete") {
      setTrees((prevTrees) =>
        prevTrees.map((tree) =>
          tree.id === currentTree.id
            ? {
                ...tree,
                nodes: tree.nodes.filter((n) => n.id !== selectedNode.id),
              }
            : tree
        )
      );
    }

    setShowMenu(false);
  };

  const renderTree = () => {
    if (!currentTree) return null;

    return (
      <>
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
          {currentTree.nodes.map((node) => {
            const parent = currentTree.nodes.find((n) => n.id === node.parentId);
            if (!parent) return null;
            return (
              <Line
                key={`line-${parent.id}-${node.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke={theme.colors.primary}
                strokeWidth="2"
              />
            );
          })}
        </Svg>

        {currentTree.nodes.map((node) => {
          const isSelected = selectedNodes.includes(node.id);
          const isParentUnlocked =
            !node.parentId || selectedNodes.includes(node.parentId);

          if (Platform.OS === "web") {
            return (
              <div
                key={`div-${node.id}`}
                style={{
                  position: "absolute",
                  left: node.x - 30,
                  top: node.y - 30,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : isParentUnlocked
                    ? theme.colors.secondaryContainer
                    : "#555",
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  cursor: "pointer",
                }}
                onMouseDown={(e) => {
                  if (e.button === 0) startDragging(node.id);
                }}
                onContextMenu={(e) => handleNodeRightClick(e, node)}
                onClick={() => {
                  if (node.parentId && !selectedNodes.includes(node.parentId)) {
                    alert("Skill Locked: Unlock parent first!");
                    return;
                  }
                  setSelectedNodes((prev) =>
                    prev.includes(node.id)
                      ? prev.filter((nid) => nid !== node.id)
                      : [...prev, node.id]
                  );
                }}
              >
                <Text
                  style={{
                    color: isSelected
                      ? theme.colors.onPrimary
                      : isParentUnlocked
                      ? theme.colors.onSecondaryContainer
                      : "white",
                    fontWeight: "bold",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {node.label}
                </Text>
              </div>
            );
          } else {
            return null;
          }
        })}
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row", backgroundColor: theme.colors.background }}>
      {/* Sidebar */}
      <View style={{ width: 220, padding: 10, backgroundColor: theme.colors.surfaceVariant }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10, color: theme.colors.onSurfaceVariant, fontSize: 18 }}>
          Skill Trees
        </Text>
        <ScrollView style={{ marginBottom: 10 }}>
          {trees.map((tree) => (
            <Pressable
              key={tree.id}
              onPress={() => {
                setSelectedTreeId(tree.id);
                setSelectedNodes([]);
              }}
              style={{
                padding: 8,
                marginBottom: 6,
                backgroundColor: tree.id === selectedTreeId ? theme.colors.primary : "transparent",
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: tree.id === selectedTreeId ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                  fontWeight: "bold",
                }}
              >
                {tree.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextInput
          placeholder="New Tree Name"
          value={newTreeName}
          onChangeText={setNewTreeName}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.primary,
            marginBottom: 8,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
            color: theme.colors.onSurface,
          }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        <Button mode="contained" onPress={createNewTree}>Create Tree</Button>
      </View>

      {/* Canvas */}
      <div
        style={{ flex: 1, position: "relative", width: "100%", height: "100%" }}
        onMouseMove={handleDrag}
        onMouseUp={stopDragging}
        onContextMenu={handleCanvasRightClick}
      >
        {renderTree()}
      </div>

      {/* Right Click Menu */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: menuPosition.y,
            left: menuPosition.x,
            backgroundColor: theme.colors.surface,
            padding: 10,
            borderRadius: 6,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          <TouchableOpacity onPress={() => handleMenuAction("add")}>
            <Text style={{ padding: 8, color: theme.colors.primary }}>➕ Add Node</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuAction("rename")}>
            <Text style={{ padding: 8, color: theme.colors.primary }}>✏️ Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuAction("delete")}>
            <Text style={{ padding: 8, color: "red" }}>🗑️ Delete</Text>
          </TouchableOpacity>
        </div>
      )}

      {/* Input Modal */}
      <Modal transparent={true} visible={showInputModal} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 300, backgroundColor: theme.colors.surface, borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: theme.colors.onSurface }}>
              {inputModalTitle}
            </Text>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.primary,
                marginBottom: 10,
                padding: 8,
                borderRadius: 6,
                color: theme.colors.onSurface, // <-- text color inside input
              }}
              placeholder="Enter name..."
              placeholderTextColor={theme.colors.onSurfaceVariant} // <-- placeholder color softer
            />
            <Button mode="contained" onPress={() => {
              if (inputAction) inputAction();
              setShowInputModal(false);
            }}>
              <Text style={{ color: theme.colors.onPrimary }}>Confirm</Text>
            </Button>
            <Button onPress={() => setShowInputModal(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: theme.colors.primary }}>Cancel</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}