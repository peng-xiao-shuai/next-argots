import { Text } from 'slate';

interface TextNode {
  text: string;
  code?: boolean;
  bold?: boolean;
  italic?: boolean;
}

interface ElementNode {
  type: string;
  children: Node[];
  relationTo?: string;
  value?: {
    id?: string;
  };
}

type Node = TextNode | ElementNode;

export const slateToHtml = (children: any[]): string =>
  children
    .map((node: Node) => {
      if (Text.isText(node)) {
        let text = node.text.replace('\n', '<br/>');

        if ((node as TextNode).bold) {
          text = `<strong>${text}</strong>`;
        }

        if ((node as TextNode).code) {
          text = `<code>${text}</code>`;
        }

        if ((node as TextNode).italic) {
          text = `<em>${text}</em>`;
        }

        return text;
      }

      if (!node) {
        return null;
      }

      if (!node.type) {
        return `<p style="margin: 0">${slateToHtml(node.children)}</p>`;
      }

      switch (node.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'blockquote':
        case 'ul':
        case 'ol':
        case 'li':
          return `<${node.type}>${slateToHtml(node.children)}</${node.type}>`;
        case 'relationship':
          return `<a href='${encodeURIComponent(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/${node.relationTo}/${node.value?.id}` ||
              ''
          )}'> #${node.value?.id} </a>`;

        default:
          return `<${node.type}>${slateToHtml(node.children)}</${node.type}>`;
      }
    })
    .join('');
