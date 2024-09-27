import Category from "../database/entity/Category";
import { UpdateCategoryDto } from "../dto/category.dto";
import { AppDataSource } from "../database/data-source";
export class CategoryService {
  constructor() {}

  generateTree = (categories: Category[]) => {
    const maxId = Math.max(...categories.map((categ) => categ.id));

    let idIndexValueParentId: (number | null)[] = Array(maxId + 1).fill(null);
    let idIndexValueData: (string | null)[] = Array(maxId + 1).fill(null);

    categories.forEach((category) => {
      // idIndexValueParentId[category.id] = category.parentId || -1;
      idIndexValueParentId[category.id] = category.isActive
        ? category.parentId || -1
        : null;
    });
    idIndexValueParentId[0] = null;

    categories.forEach((category) => {
      idIndexValueData[category.id] = category.name;
    });

    type Nod = {
      nodeId: number | null;
      children: Nod[];
    };

    const categNode: Nod = {
      nodeId: -1,
      children: [],
    };

    function generate(nod: Nod) {
      if (idIndexValueParentId.every((val) => val === null)) return;

      idIndexValueParentId.forEach((parentId, id) => {
        if (parentId === nod.nodeId && parentId !== null) {
          nod.children.push({ nodeId: id, children: [] });
          idIndexValueParentId[id] = null;
          nod.children.forEach((node) => {
            generate(node);
          });
        }
      });
    }

    generate(categNode);
    return { categNode, idIndexValueData };
  };

  generateHtmlTree = (categories: Category[]): string => {
    const { categNode, idIndexValueData } = this.generateTree(categories);

    const displayedCategories = new Set<number>();

    const generate = (node: any): string => {
      const nodeName =
        idIndexValueData[node.nodeId] !== null &&
        idIndexValueData[node.nodeId] !== undefined
          ? idIndexValueData[node.nodeId]
          : "Categories";

      if (displayedCategories.has(node.nodeId)) {
        return "";
      }

      displayedCategories.add(node.nodeId);

      if (!node.children || node.children.length === 0) {
        return `<li>${nodeName} (${node.nodeId})</li>`;
      }

      const childrenHtml = node.children
        .map((child: any) => generate(child))
        .join("");
      return `<li>${nodeName} (${
        node.nodeId !== -1 ? node.nodeId : ""
      })<ul>${childrenHtml}</ul></li>`;
    };

    const htmlTree = `<ul>${generate(categNode)}</ul>`;

    return htmlTree;
  };
}

