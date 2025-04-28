# SkillTreePage Component Structure

```mermaid
flowchart TD
  A([SkillTreePage Component])

  subgraph State
    B1[Trees]
    B2[Selected Tree / Nodes]
    B3[Dragging ID & Start Pos]
    B4[Menus & Modal States]
  end

  subgraph Events
    C1(startDragging)
    C2(stopDragging)
    C3(handleDrag)
    C4(handleCanvasRightClick)
    C5(handleNodeRightClick)
    C6(handleMenuAction)
    C7(handleConfirmInput)
    C8(createNewTree)
  end

  subgraph UI
    D1(Sidebar - Skill Trees)
    D2(Canvas - Nodes + Lines)
    D3(Right Click Popup)
    D4(Input Modal)
  end

  A --> State
  A --> Events
  A --> UI

  State --> B1
  State --> B2
  State --> B3
  State --> B4

  Events --> C1
  Events --> C2
  Events --> C3
  Events --> C4
  Events --> C5
  Events --> C6
  Events --> C7
  Events --> C8

  UI --> D1
  UI --> D2
  UI --> D3
  UI --> D4