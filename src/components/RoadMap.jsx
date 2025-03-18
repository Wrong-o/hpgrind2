import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const RoadMap = () => {
  const topics = [{
    title: 'Arrays & Hashing',
    progress: 75,
    children: [{
      title: 'Two Pointers',
      progress: 60,
      children: [{
        title: 'Sliding Window',
        progress: 40
      }, {
        title: 'Linked List',
        progress: 50
      }, {
        title: 'Binary Search',
        progress: 30
      }]
    }, {
      title: 'Stack',
      progress: 45
    }]
  }];
  const renderProgressBar = progress => /*#__PURE__*/_jsx("div", {
    className: "h-2 w-full bg-gray-200 rounded-full overflow-hidden",
    children: /*#__PURE__*/_jsx("div", {
      className: "h-full bg-green-500 transition-all duration-500",
      style: {
        width: `${progress}%`
      }
    })
  });
  const renderNode = (node, level = 0) => {
    return /*#__PURE__*/_jsxs("div", {
      className: `relative ${level > 0 ? 'ml-12' : ''}`,
      children: [/*#__PURE__*/_jsxs("div", {
        className: "bg-blue-600 rounded-xl p-4 shadow-lg mb-4 w-64",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-white font-bold mb-2",
          children: node.title
        }), renderProgressBar(node.progress)]
      }), node.children && node.children.map((child, index) => /*#__PURE__*/_jsxs("div", {
        className: "relative",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -left-8 top-0 w-8 h-[50%] border-l-2 border-t-2 border-white"
        }), renderNode(child, level + 1)]
      }, child.title))]
    }, node.title);
  };
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 flex items-center justify-center",
    children: /*#__PURE__*/_jsxs("div", {
      className: "w-[80%] h-[80%] bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl shadow-2xl overflow-hidden p-8",
      children: [/*#__PURE__*/_jsx("h1", {
        className: "text-3xl font-bold mb-8 text-center text-white",
        children: "Dina framsteg"
      }), /*#__PURE__*/_jsx(TransformWrapper, {
        initialScale: 1,
        minScale: 0.5,
        maxScale: 2,
        centerOnInit: true,
        wheel: {
          step: 0.1
        },
        children: ({
          zoomIn,
          zoomOut,
          resetTransform
        }) => /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "absolute top-4 right-4 space-x-2 z-10",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => zoomIn(),
              className: "bg-white/10 hover:bg-white/20 text-white rounded-lg p-2",
              children: /*#__PURE__*/_jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /*#__PURE__*/_jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                })
              })
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => zoomOut(),
              className: "bg-white/10 hover:bg-white/20 text-white rounded-lg p-2",
              children: /*#__PURE__*/_jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /*#__PURE__*/_jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M20 12H4"
                })
              })
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => resetTransform(),
              className: "bg-white/10 hover:bg-white/20 text-white rounded-lg p-2",
              children: /*#__PURE__*/_jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /*#__PURE__*/_jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                })
              })
            })]
          }), /*#__PURE__*/_jsx(TransformComponent, {
            wrapperClass: "!w-full !h-full",
            contentClass: "!w-full !h-full flex items-center justify-center",
            children: /*#__PURE__*/_jsx("div", {
              className: "relative",
              children: topics.map(topic => renderNode(topic))
            })
          })]
        })
      })]
    })
  });
};
