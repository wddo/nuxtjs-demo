export default {
  name: "utils",
  methods: {
    getChildrenTagContent: children => children.filter(node => node.tag)
  }
};
