"use client";

import { FC, useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Edit,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TreeNode } from "@/models/menu";
import { getLucideIcon } from "@/lib/utils";
import { useRouter } from "next/navigation";



// const initialTree: TreeNode[] = [
//   {
//     id: "1",
//     name: "Dashboard",
//     children: [
//       { id: "1-1", name: "Analytics" },
//       { id: "1-2", name: "Reports" },
//     ],
//   },
//   {
//     id: "2",
//     name: "Settings",
//     children: [{ id: "2-1", name: "User Management" }],
//   },
//   {
//     id: "3",
//     name: "Profile",
//   },
// ];

type Props = {
    menus: TreeNode[]
}

export const DraggableMenu:FC<Props> = ({menus}) => {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter()
  useEffect(() => {
    setTree(menus)
  },[menus]);

  // Top-level drag end handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Find the indexes in the top-level tree
    const oldIndex = tree.findIndex((node) => node.id === active.id);
    const newIndex = tree.findIndex((node) => node.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setTree(arrayMove(tree, oldIndex, newIndex));
  };

  // Child-level drag end handler. It receives the parent id.
  const handleChildDragEnd = (event: DragEndEvent, parentId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTree((prevTree) => {
      // recursive updater: looks for the parent node by id
      const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId && node.children) {
            const oldIndex = node.children.findIndex((child) => child.id === active.id);
            const newIndex = node.children.findIndex((child) => child.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return node;
            return { ...node, children: arrayMove(node.children, oldIndex, newIndex) };
          } else if (node.children) {
            return { ...node, children: updateNodes(node.children) };
          }
          return node;
        });
      };
      return updateNodes(prevTree);
    });
  };

  // Remove a node (works recursively)
  const handleRemove = (id: string) => {
    const removeItem = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: node.children ? removeItem(node.children) : undefined,
        }));
    };
    setTree(removeItem(tree));
  };

  // Edit a node’s name (recursive update)
  const handleEdit = (id: string, newName: string) => {
    // console.log("handleEdit", id, newName);
    const updateItem = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, name: newName }
          : { ...node, children: node.children ? updateItem(node.children) : undefined }
      );
    setTree(updateItem(tree));
    setEditing(null);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tree.map((node) => node.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 p-4 w-full bg-gray-100 rounded-lg">
          {tree.map((node) => (
            <TreeNodeComponent
              key={node.id}
              node={node}
              expanded={expanded}
              setExpanded={setExpanded}
              editing={editing}
              setEditing={setEditing}
              handleRemove={handleRemove}
              handleEdit={handleEdit}
              handleChildDragEnd={handleChildDragEnd}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface TreeNodeComponentProps {
  node: TreeNode;
  expanded: string[];
  setExpanded: (ids: string[]) => void;
  editing: { id: string; name: string } | null;
  setEditing: (edit: { id: string; name: string } | null) => void;
  handleRemove: (id: string) => void;
  handleEdit: (id: string, newName: string) => void;
  handleChildDragEnd: (event: DragEndEvent, parentId: string) => void;
}

function TreeNodeComponent({
  node,
  expanded,
  setExpanded,
  editing,
  setEditing,
  handleRemove,
  handleEdit,
  handleChildDragEnd,
}: TreeNodeComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const Icon = getLucideIcon(node.icon);
  const router = useRouter()
  
  const isExpanded = expanded.includes(node.id);
  const toggleExpand = () => {
    setExpanded(isExpanded ? expanded.filter((id) => id !== node.id) : [...expanded, node.id]);
  };

  return (
    <div className="ml-4">
      <Card ref={setNodeRef} style={style} className="flex items-center p-2 bg-white shadow rounded-md">
        {node.children && (
          <button onClick={toggleExpand} className="p-2">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        <Icon className="w-5 h-5 text-blue-500" />
        <button {...attributes} {...listeners} className="cursor-grab p-2">
          <GripVertical size={20} />
        </button>

        {editing?.id === node.id ? (
          <Input
            autoFocus
            defaultValue={node.name}
            onBlur={(e) => handleEdit(node.id, e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleEdit(node.id, (e.target as HTMLInputElement).value)
            }
            className="ml-2 flex-grow"
          />
        ) : (
          <span className="ml-2 flex-grow">{node.name}</span>
        )}

        <button
          onClick={() => {
            // setEditing({ id: node.id, name: node.name })
            router.push(`/admin/menu/${node.id}`)
          }}
          className="p-2 text-blue-500"
        >
          <Edit size={18} />
        </button>
        <button onClick={() => handleRemove(node.id)} className="p-2 text-red-500">
          <Trash2 size={18} />
        </button>
      </Card>

      {/* Render children if available */}
      {node.children && isExpanded && (
        <div className="ml-6 mt-2">
          {/* Wrap the children in their own DndContext so they can be reordered */}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleChildDragEnd(event, node.id)}
          >
            <SortableContext items={node.children.map((child) => child.id)} strategy={verticalListSortingStrategy}>
              {node.children.map((child) => (
                <TreeNodeComponent
                  key={child.id}
                  node={child}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  editing={editing}
                  setEditing={setEditing}
                  handleRemove={handleRemove}
                  handleEdit={handleEdit}
                  handleChildDragEnd={handleChildDragEnd}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
