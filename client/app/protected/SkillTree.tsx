// Import necessary React and React Native modules
import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, Platform, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Line } from "react-native-svg"; // For drawing connector lines between nodes
import { Button, useTheme } from "react-native-paper"; // Material UI components

// Define a single skill node with position and parent info
interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId?: string;
}

// Define a full skill tree structure
interface SkillTree {
  id: string;
  name: string;
  nodes: SkillNode[];
}

export default function SkillTreePage() {
  const theme = useTheme();

  // Initialize trees with a default "Main Tree" and some nested skills
  const [trees, setTrees] = useState<SkillTree[]>([{
    id: "tree1",
    name: "Main Tree",
    nodes: [
      { id: "1", label: "Programming", x: 180, y: 50 },
      { id: "2", label: "Frontend", x: 80, y: 180, parentId: "1" },
      { id: "3", label: "Backend", x: 280, y: 180, parentId: "1" },
      { id: "4", label: "React", x: 30, y: 300, parentId: "2" },
      { id: "5", label: "Node.js", x: 230, y: 300, parentId: "3" },
    ]
  }]);

  // Tree & Node state controls
  const [selectedTreeId, setSelectedTreeId] = useState<string>("tree1");
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [newTreeName, setNewTreeName] = useState("");

  // Dragging logic
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Context menu
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  // Input modal state for renaming/adding
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputModalTitle, setInputModalTitle] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [pendingAction, setPendingAction] = useState<"add" | "rename" | "root" | null>(null);

  // Get the current active tree
  const currentTree = trees.find(tree => tree.id === selectedTreeId);

  // Begin dragging a node
  const startDragging = (nodeId: string, x: number, y: number) => {
    setDraggingNodeId(nodeId);
    setDragStartPosition({ x, y });
    setIsDragging(false);
  };

  // Stop dragging action
  const stopDragging = () => {
    setDraggingNodeId(null);
    setDragStartPosition(null);
    setIsDragging(false);
  };

  // Handle mouse drag and repositioning of nodes
  const handleDrag = (e: any) => {
    if (!draggingNodeId || !currentTree) return;
    if (e.buttons !== 1) return;

    const boundingRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - boundingRect.left;
    const mouseY = e.clientY - boundingRect.top;

    setIsDragging(true);

    const updatedNodes = currentTree.nodes.map(node =>
      node.id === draggingNodeId ? { ...node, x: mouseX, y: mouseY } : node
    );

    setTrees(prevTrees =>
      prevTrees.map(tree =>
        tree.id === currentTree.id ? { ...tree, nodes: updatedNodes } : tree
      )
    );
  };

  // Handle right click on empty canvas
  const handleCanvasRightClick = (e: any) => {
    e.preventDefault();
    if (currentTree?.nodes.length === 0) {
      setInputModalTitle("Create Root Node");
      setPendingAction("root");
      setInputValue("");
      setShowInputModal(true);
    }
  };

  // Handle right click on a node
  const handleNodeRightClick = (e: any, node: SkillNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNode(node);
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  // Create a new skill tree
  const createNewTree = () => {
    if (!newTreeName.trim()) return;
    const newTree: SkillTree = { id: `tree-${Date.now()}`, name: newTreeName, nodes: [] };
    setTrees([...trees, newTree]);
    setSelectedTreeId(newTree.id);
    setSelectedNodes([]);
    setNewTreeName("");
  };

  // Perform actions from the node's context menu
  const handleMenuAction = (action: "add" | "rename" | "delete") => {
    if (!currentTree || !selectedNode) return;

    if (action === "add") {
      setInputModalTitle("Add Child Skill");
      setPendingAction("add");
      setInputValue("");
      setShowInputModal(true);
    } else if (action === "rename") {
      setInputModalTitle("Rename Skill");
      setPendingAction("rename");
      setInputValue(selectedNode.label);
      setShowInputModal(true);
    } else if (action === "delete") {
      // Delete the selected node and reassign children
      setTrees(prevTrees =>
        prevTrees.map(tree =>
          tree.id === currentTree.id
            ? {
                ...tree,
                nodes: tree.nodes.filter(n => n.id !== selectedNode.id)
                  .map(n => (n.parentId === selectedNode.id ? { ...n, parentId: selectedNode.parentId } : n))
              }
            : tree
        )
      );
    }
    setShowMenu(false);
  };

  // Confirm input modal actions (add/rename/root)
  const handleConfirmInput = () => {
    if (!pendingAction || !inputValue.trim()) return;

    if (pendingAction === "root" && currentTree) {
      const rootNode: SkillNode = { id: `node-${Date.now()}`, label: inputValue, x: 300, y: 100 };
      setTrees(prevTrees =>
        prevTrees.map(tree =>
          tree.id === currentTree.id ? { ...tree, nodes: [rootNode] } : tree
        )
      );
    } else if (pendingAction === "add" && currentTree && selectedNode) {
      const newNode: SkillNode = {
        id: `node-${Date.now()}`,
        label: inputValue,
        x: selectedNode.x + 100,
        y: selectedNode.y + 100,
        parentId: selectedNode.id
      };
      setTrees(prevTrees =>
        prevTrees.map(tree =>
          tree.id === currentTree.id ? { ...tree, nodes: [...tree.nodes, newNode] } : tree
        )
      );
    } else if (pendingAction === "rename" && currentTree && selectedNode) {
      setTrees(prevTrees =>
        prevTrees.map(tree =>
          tree.id === currentTree.id
            ? {
                ...tree,
                nodes: tree.nodes.map(n =>
                  n.id === selectedNode.id ? { ...n, label: inputValue } : n
                )
              }
            : tree
        )
      );
    }

    setShowInputModal(false);
    setPendingAction(null);
  };

  // Render all lines and nodes in the tree
  const renderTree = () => {
    if (!currentTree) return null;

    return (
      <>
        {/* Render connecting lines between parent-child */}
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
          {currentTree.nodes.map(node => {
            const parent = currentTree.nodes.find(n => n.id === node.parentId);
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

        {/* Render draggable, clickable skill nodes */}
        {currentTree.nodes.map(node => {
          const isSelected = selectedNodes.includes(node.id);
          const isParentUnlocked = !node.parentId || selectedNodes.includes(node.parentId);

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
                  if (e.button === 0) startDragging(node.id, e.clientX, e.clientY);
                }}
                onContextMenu={(e) => handleNodeRightClick(e, node)}
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

  // Main render section
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row", backgroundColor: theme.colors.background }}>
      {/* Sidebar: Tree list & Create button */}
      <View style={{ width: 220, padding: 10, backgroundColor: theme.colors.surfaceVariant }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10, color: theme.colors.onSurfaceVariant, fontSize: 18 }}>
          Skill Trees
        </Text>

        <ScrollView style={{ marginBottom: 10 }}>
          {trees.map(tree => (
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
                borderRadius: 6
              }}
            >
              <Text style={{
                color: tree.id === selectedTreeId ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                fontWeight: "bold"
              }}>{tree.name}</Text>
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
            color: theme.colors.onSurface
          }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        <Button mode="contained" onPress={createNewTree}>Create Tree</Button>
      </View>

      {/* Skill Tree Canvas (web only) */}
      <div
        style={{ flex: 1, position: "relative", width: "100%", height: "100%" }}
        onMouseMove={handleDrag}
        onMouseUp={(e) => {
          if (!isDragging && draggingNodeId) {
            const clickedNode = currentTree?.nodes.find(n => n.id === draggingNodeId);
            if (clickedNode) {
              if (clickedNode.parentId && !selectedNodes.includes(clickedNode.parentId)) {
                alert("Skill Locked: Unlock parent first!");
              } else {
                setSelectedNodes(prev =>
                  prev.includes(clickedNode.id)
                    ? prev.filter(id => id !== clickedNode.id)
                    : [...prev, clickedNode.id]
                );
              }
            }
          }
          stopDragging();
        }}
        onContextMenu={handleCanvasRightClick}
      >
        {renderTree()}
      </div>

      {/* Right-click context menu */}
      {showMenu && (
        <div style={{
          position: "absolute",
          top: menuPosition.y,
          left: menuPosition.x,
          backgroundColor: theme.colors.surface,
          padding: 10,
          borderRadius: 6,
          boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
          zIndex: 100
        }}>
          <TouchableOpacity onPress={() => handleMenuAction("add")}><Text style={{ padding: 8, color: theme.colors.primary }}>Add Node</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuAction("rename")}><Text style={{ padding: 8, color: theme.colors.primary }}>Rename</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuAction("delete")}><Text style={{ padding: 8, color: "red" }}>Delete</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(false)}><Text style={{ padding: 8, color: theme.colors.onSurfaceVariant }}>Cancel</Text></TouchableOpacity>
        </div>
      )}

      {/* Modal for input (create root, rename, add) */}
      <Modal transparent={true} visible={showInputModal} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 300, backgroundColor: theme.colors.surface, borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: theme.colors.onSurface }}>{inputModalTitle}</Text>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.primary,
                marginBottom: 10,
                padding: 8,
                borderRadius: 6,
                color: theme.colors.onSurface
              }}
              placeholder="Enter name..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            <Button mode="contained" onPress={handleConfirmInput}>
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