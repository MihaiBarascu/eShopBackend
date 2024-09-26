let vectorFrecventa: (number | null)[];

vectorFrecventa = [null, -1, -1, 1, -1, 2, 1, 3];

type Nod = {
  nodeId: number;
  children: Nod[];
};

const nodInitial: Nod = {
  nodeId: -1,
  children: [],
};

function fRecursiva(nod: Nod) {
  if (vectorFrecventa.every((val) => val === null)) return;

  vectorFrecventa.forEach((parentId, id) => {
    if (parentId === nod.nodeId) {
      nod.children.push({ nodeId: id, children: [] });
      vectorFrecventa[id] = null;
      nod.children.forEach((node) => {
        fRecursiva(node);
      });
    }
  });
}

fRecursiva(nodInitial);

function parcurgereArbore(nod: Nod) {
  nod.children.forEach((node) => {
    console.log(node.nodeId);
    parcurgereArbore(node);
  });
}

console.log(nodInitial);

parcurgereArbore(nodInitial);
