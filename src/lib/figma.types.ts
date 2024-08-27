/**
 * Figmas API resources are inconsistent. As a general convention we use the suffix `Metadata`
 * when the resource is returned alongside a File or Node resource. These objects are more terse than their complete
 * counterparts that are served by the dedicated API endpoints.
 *
 * See for examples ComponentMetadata and ComponentSetMetadata vs Component and ComponentSet.
 *
 * These should not be confused with the ComponentNode or ComponentSetNode which are the actual nodes in the Figma file.
 *
 */
namespace Figma {
  export enum NodeType {
    DOCUMENT = "DOCUMENT",
    CANVAS = "CANVAS",
    FRAME = "FRAME",
    GROUP = "GROUP",
    SECTION = "SECTION",
    VECTOR = "VECTOR",
    BOOLEAN_OPERATION = "BOOLEAN_OPERATION",
    STAR = "STAR",
    LINE = "LINE",
    ELLIPSE = "ELLIPSE",
    REGULAR_POLYGON = "REGULAR_POLYGON",
    RECTANGLE = "RECTANGLE",
    TEXT = "TEXT",
    SLICE = "SLICE",
    COMPONENT = "COMPONENT",
    COMPONENT_SET = "COMPONENT_SET",
    INSTANCE = "INSTANCE",
    STICKY = "STICKY",
    SHAPE_WITH_TEXT = "SHAPE_WITH_TEXT",
    CONNECTOR = "CONNECTOR",
    TABLE = "TABLE",
    TABLE_CELL = "TABLE_CELL",
    WASHI_TAPE = "WASHI_TAPE",
  }

  export interface Node<T extends NodeType = NodeType> {
    // A string uniquely identifying this node within the document.
    id: string;
    // The name given to the node by the user in the tool.
    name: string;
    // Whether or not the node is visible on the canvas.
    // default: true
    visible?: boolean;
    // The type of the node, refer to table below for details.
    type: T;
    // The rotation of the node, if not 0.
    rotation?: number;
    // Data written by plugins that is visible only to the plugin that wrote it. Requires the `pluginData` to include the ID of the plugin.
    pluginData?: any;
    // Data written by plugins that is visible to all plugins. Requires the `pluginData` parameter to include the string "shared".
    sharedPlugi?: any;
    // A mapping of a layer's property to component property name of component properties attached to this node. The component property name can be used to look up more information on the corresponding component's or component set's componentPropertyDefinitions.
    componentPropertyReferences?: Record<string, string>;
    // A mapping of field to the variables applied to this field. Most fields will only map to a single
    boundVariables?: Record<string, VariableAlias | VariableAlias[]>;
  }

  export interface DocumentNode extends Node {
    // An array of canvases attached to the document
    children: Node[];
  }

  export interface CanvasNode extends Node {
    // An array of top level layers on the canvas
    children: Node[];
    // Background color of the canvas.
    backgroundColor: Color;
    // [DEPRECATED] Node ID that corresponds to the start frame for prototypes. This is deprecated with the introduction of multiple flows. Please use the flowStartingPoints field.
    prototypeStartNodeID: string;
    // A array of flow starting points sorted by its position in the prototype settings panel.
    // default: []
    flowStartingPoints?: FlowStartingPoint[];
    // The device used to view a prototype
    prototypeDevice: PrototypeDevice;
    // An array of export settings representing images to export from the canvas
    // default: []
    exportSettings?: ExportSetting[];
  }

  export interface FrameNode extends Node {
    // An array of nodes that are direct children of this node
    children: Node[];
    // If true, layer is locked and cannot be edited
    // default: false
    locked?: boolean;
    // [DEPRECATED] Background of the node. This is deprecated, as backgrounds for frames are now in the fills field.
    background: Paint[];
    // [DEPRECATED] Background color of the node. This is deprecated, as frames now support more than a solid color as a background. Please use the fills field instead.
    backgroundColor: Color;
    // An array of fill paints applied to the node
    // default: []
    fills?: Paint[];
    // An array of stroke paints applied to the node
    // default: []
    strokes?: Paint[];
    // The weight of strokes on the node
    strokeWeight: number;
    // Position of stroke relative to vector outline, as a string enum
    strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
    // An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows. For example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
    // default: []
    strokeDashes?: number[];
    // Radius of each corner of the frame if a single radius is set for all corners
    cornerRadius: number;
    // Array of length 4 of the radius of each corner of the frame, starting in the top left and proceeding clockwise
    // default: same as cornerRadius
    rectangleCornerRadii?: number[];
    // A value that lets you control how "smooth" the corners are. Ranges from 0 to 1. 0 is the default and means that the corner is perfectly circular. A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape. Other values produce various other curves. See
    cornerSmoothing: number;
    // An array of export settings representing images to export from the node
    // default: []
    exportSettings?: ExportSetting[];
    // How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blendMode: BlendMode;
    // Keep height and width constrained to same ratio
    // default: false
    preserveRatio?: boolean;
    // Horizontal and vertical layout constraints for node
    constraints: LayoutConstraint;
    // Determines if the layer should stretch along the parent’s counter axis. This property is only provided for direct children of auto-layout frames.
    layoutAlign: "INHERIT" | "STRETCH" | "MIN" | "CENTER" | "MAX" | "STRETCH";
    // Node ID of node to transition to in prototyping
    // default: null
    transitionNodeID?: string;
    // The duration of the prototyping transition on this node (in milliseconds)
    // default: null
    transitionDuration?: number;
    // The easing curve used in the prototyping transition on this node
    // default: null
    transitionEasing?: EasingType;
    // Opacity of the node
    // default: 1
    opacity?: number;
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
    size?: Vector;
    // The minWidth of the frame, or null if not set.
    // default: null
    minWidth?: number;
    // The maxWidth of the frame, or null if not set.
    // default: null
    maxWidth?: number;
    // The minHeight of the frame, or null if not set.
    // default: null
    minHeight?: number;
    // The maxHeight of the frame, or null if not set.
    // default: null
    maxHeight?: number;
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform?: Transform;
    // Whether or not this node clip content outside of its bounds
    clipsContent: boolean;
    // Whether this layer uses auto-layout to position its children.
    // default: NONE
    layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
    // The horizontal sizing setting on this auto-layout frame or frame child.
    layoutSizingHorizontal: "FIXED" | "HUG" | "FILL";
    // The vertical sizing setting on this auto-layout frame or frame child.
    layoutSizingVertical: "FIXED" | "HUG" | "FILL";
    // Whether this auto-layout frame has wrapping enabled.
    // default: NO_WRAP
    layoutWrap?: "NO_WRAP" | "WRAP";
    // Whether the primary axis has a fixed length (determined by the user) or an automatic length (determined by the layout engine). This property is only applicable for auto-layout frames.
    // default: AUTO
    primaryAxisSizingMode?: "FIXED" | "AUTO";
    // Whether the counter axis has a fixed length (determined by the user) or an automatic length (determined by the layout engine). This property is only applicable for auto-layout frames.
    // default: AUTO
    counterAxisSizingMode?: "FIXED" | "AUTO";
    // Determines how the auto-layout frame’s children should be aligned in the primary axis direction. This property is only applicable for auto-layout frames.
    // default: MIN
    primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
    // Determines how the auto-layout frame’s children should be aligned in the counter axis direction. This property is only applicable for auto-layout frames.
    // default: MIN
    counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "BASELINE";
    // Determines how the auto-layout frame’s wrapped tracks should be aligned in the counter axis direction. This property is only applicable for auto-layout frames with
    // default: AUTO
    counterAxisAlignContent?: "AUTO" | "SPACE_BETWEEN";
    // The padding between the left border of the frame and its children. This property is only applicable for auto-layout frames.
    // default: 0
    paddingLeft?: number;
    // The padding between the right border of the frame and its children. This property is only applicable for auto-layout frames.
    // default: 0
    paddingRight?: number;
    // The padding between the top border of the frame and its children. This property is only applicable for auto-layout frames.
    // default: 0
    paddingTop?: number;
    // The padding between the bottom border of the frame and its children. This property is only applicable for auto-layout frames.
    // default: 0
    paddingBottom?: number;
    // The horizontal padding between the borders of the frame and its children. This property is only applicable for auto-layout frames. Deprecated in favor of setting individual paddings.
    // default: 0
    horizontalPadding?: number;
    // The vertical padding between the borders of the frame and its children. This property is only applicable for auto-layout frames. Deprecated in favor of setting individual paddings.
    // default: 0
    verticalPadding?: number;
    // The distance between children of the frame. Can be negative. This property is only applicable for auto-layout frames.
    // default: 0
    itemSpacing?: number;
    // The distance between wrapped tracks of an auto-layout frame. This property is only applicable for auto-layout frames with
    // default: 0
    counterAxisSpacing?: number;
    // default: AUTO
    // If not present assume AUTO
    layoutPositioning?: "ABSOLUTE" | "AUTO";
    // Determines the canvas stacking order of layers in this frame. When true, the first layer will be draw on top. This property is only applicable for auto-layout frames.
    // default: false
    itemReverseZIndex?: boolean;
    // Determines whether strokes are included in layout calculations. When true, auto-layout frames behave like css "box-sizing: border-box". This property is only applicable for auto-layout frames.
    // default: false
    strokesIncludedInLayout?: boolean;
    // default: []
    layoutGrids?: LayoutGrid[];
    // Defines the scrolling behavior of the frame, if there exist contents outside of the frame boundaries. The frame can either scroll vertically, horizontally, or in both directions to the extents of the content contained within it. This behavior can be observed in a prototype.
    // default: NONE
    overflowDirection?:
      | "HORIZONTAL_SCROLLING"
      | "VERTICAL_SCROLLING"
      | "HORIZONTAL_AND_VERTICAL_SCROLLING";
    // An array of effects attached to this node (see effects section for more details)
    // default: []
    effects?: Effect[];
    // Does this node mask sibling nodes in front of it?
    // default: false
    isMask?: boolean;
    // [DEPRECATED] Whether the mask ignores fill style (e.g. gradients) and effects. This property is deprecated; please use the
    // default: false
    isMaskOutline?: boolean;
    // If this layer is a mask, this property describes the operation used to mask the layer's siblings. The value may be one of the following:
    maskType?: "ALPHA" | "VECTOR" | "LUMINANCE";
    // A mapping of a StyleType to style ID (see
    styles: Record<StyleType, string>;
  }

  export interface GroupNode extends FrameNode {}

  export interface SectionNode extends Node {
    // Whether the contents of the section are visible
    // default: false
    sectionContentsHidden?: boolean;
    // Whether the section is marked
    // default: null
    devStatus?: Object;
    // An array of fill paints applied to the node
    // default: []
    fills?: Paint[];
    // An array of stroke paints applied to the node
    // default: []
    strokes?: Paint[];
    // The weight of strokes on the node
    strokeWeight: number;
    // Position of stroke relative to vector outline, as a string enum
    strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
    // An array of nodes that are contained in the section
    children: Node[];
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
  }

  export interface VectorNode extends Node {
    // If true, layer is locked and cannot be edited
    // default: false
    locked?: boolean;
    // An array of export settings representing images to export from the node
    // default: []
    exportSettings?: ExportSetting[];
    // How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blendMode: BlendMode;
    // Keep height and width constrained to same ratio
    // default: false
    preserveRatio?: boolean;
    // Determines if the layer should stretch along the parent’s counter axis. This property is only provided for direct children of auto-layout frames.
    layoutAlign: "INHERIT" | "STRETCH" | "MIN" | "CENTER" | "MAX" | "STRETCH";
    // This property is applicable only for direct children of auto-layout frames, ignored otherwise. Determines whether a layer should stretch along the parent’s primary axis. A 0 corresponds to a fixed size and 1 corresponds to stretch
    // default: 0
    layoutGrow?: number;
    // Horizontal and vertical layout constraints for node
    constraints: LayoutConstraint;
    // Node ID of node to transition to in prototyping
    // default: null
    transitionNodeID?: string;
    // The duration of the prototyping transition on this node (in milliseconds)
    // default: null
    transitionDuration?: number;
    // The easing curve used in the prototyping transition on this node
    // default: null
    transitionEasing?: EasingType;
    // Opacity of the node
    // default: 1
    opacity?: number;
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // An array of effects attached to this node (see effects section for more details)
    // default: []
    effects?: Effect[];
    // Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
    size?: Vector;
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform?: Transform;
    // Does this node mask sibling nodes in front of it?
    // default: false
    isMask?: boolean;
    // An array of fill paints applied to the node
    // default: []
    fills?: Paint[];
    // Only specified if parameter geometry=paths is used. An array of paths representing the object fill
    fillGeometry?: Path[];
    // Map from ID to
    fillOverrideTable?: Record<number, PaintOverride>;
    // An array of stroke paints applied to the node
    // default: []
    strokes?: Paint[];
    // The weight of strokes on the node
    strokeWeight: number;
    // An object including the top, bottom, left, and right stroke weights. Only returned if individual stroke weights are used.
    individualStrokeWeights?: StrokeWeights;
    // A string enum with value of "NONE", "ROUND", "SQUARE", "LINE_ARROW", or "TRIANGLE_ARROW", describing the end caps of vector paths.
    // default: "NONE"
    strokeCap?: string;
    // A string enum with value of "MITER", "BEVEL", or "ROUND", describing how corners in vector paths are rendered.
    // default: "MITER"
    strokeJoin?: string;
    // An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows. For example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
    // default: []
    strokeDashes?: number[];
    // Only valid if strokeJoin is "MITER". The corner angle, in degrees, below which strokeJoin will be set to "BEVEL" to avoid super sharp corners. By default this is 28.96 degrees.
    // default: 28.96
    strokeMiterAngle?: number;
    // Only specified if parameter geometry=paths is used. An array of paths representing the object stroke
    strokeGeometry?: Path[];
    // Position of stroke relative to vector outline, as a string enum
    strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
    // A mapping of a StyleType to style ID. Figma sends these lower case but allow for documented case as well.
    styles: Partial<
      Record<StyleType | "fill" | "text" | "effect" | "grid", string>
    >;
  }

  export interface BooleanOperationNode extends VectorNode {
    // An array of nodes that are being boolean operated on
    children: Node[];
    // A string enum with value of "UNION", "INTERSECT", "SUBTRACT", or "EXCLUDE" indicating the type of boolean operation applied
    booleanOperation: string;
  }

  export interface StarNode extends VectorNode {}

  export interface LineNode extends VectorNode {}

  export interface EllipseNode extends VectorNode {
    // Start and end angles of the ellipse measured clockwise from the x axis, plus the inner radius for donuts
    arcData: ArcData;
  }

  export interface RegularPolygonNode extends VectorNode {}

  export interface RectangleNode extends VectorNode {
    // Radius of each corner of the rectangle if a single radius is set for all corners
    cornerRadius: number;
    // Array of length 4 of the radius of each corner of the rectangle, starting in the top left and proceeding clockwise
    rectangleCornerRadii: number[];
    // A value that lets you control how "smooth" the corners are. Ranges from 0 to 1. 0 is the default and means that the corner is perfectly circular. A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape. Other values produce various other curves. See
    cornerSmoothing: number;
  }

  export interface TableNode extends Node {
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blendMode: BlendMode;
    // An array of table cell nodes within the table. The table cells are sorted by row, then column.
    children: Node[];
    // Horizontal and vertical layout constraints for node
    constraints: LayoutConstraint;
    // An array of effects attached to this node (see effects section for more details)
    // default: []
    effects?: Effect[];
    // An array of export settings representing images to export from the node
    // default: []
    exportSettings?: ExportSetting[];
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform: Transform;
    // Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
    size: Vector;
    // An array of stroke paints applied to the node
    // default: []
    strokes?: Paint[];
    // Position of stroke relative to vector outline, as a string enum
    strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
    // The weight of strokes on the node
    strokeWeight: number;
  }

  export interface TableCellNode extends Node {
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // Text contained within a text box
    characters: string;
    // An array of fill paints applied to the node
    // default: []
    fills?: Paint[];
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform: Transform;
    // Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
    size: Vector;
  }

  export interface TextNode extends VectorNode {
    // Text contained within a text box
    characters: string;
    // Style of text including font family and weight (see type style section for more information)
    style: TypeStyle;
    // Array with same number of elements as characters in text box, each element is a reference to the styleOverrideTable
    // defined below and maps to the corresponding character in the characters field. Elements with value 0 have the default
    // type style
    characterStyleOverrides: number[];
    // Map from ID to
    styleOverrideTable: Record<string, Partial<TypeStyle>>;
    // An array with the same number of elements as lines in the text node, where lines are delimited by newline or paragraph separator characters. Each element in the array corresponds to the list type of a specific line. List types are represented as string enums with one of these possible values:
    lineTypes: ("ORDERED" | "UNORDERED" | "NONE")[];

    // Manually added as not documented

    // An array with the same number of elements as lines in the text node, where lines are delimited by newline or paragraph separator characters. Each element in the array corresponds to the indentation level of a specific line.
    lineIndentations: number[];
    // The horizontal sizing setting on this auto-layout frame or frame child.
    layoutSizingHorizontal: "FIXED" | "HUG" | "FILL";
    // The vertical sizing setting on this auto-layout frame or frame child.
    layoutSizingVertical: "FIXED" | "HUG" | "FILL";
    // Determines if the layer should stretch along the parent’s counter axis. This property is only provided for direct children of auto-layout frames.
    layoutAlign: "INHERIT" | "STRETCH" | "MIN" | "CENTER" | "MAX" | "STRETCH";
    // This property is applicable only for direct children of auto-layout frames, ignored otherwise. Determines whether a layer should stretch along the parent’s primary axis. A 0 corresponds to a fixed size and 1 corresponds to stretch
    // default: 0
    layoutGrow?: number;
  }

  export interface SliceNode extends Node {
    // An array of export settings representing images to export from this node
    exportSettings: ExportSetting[];
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
    size: Vector;
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform: Transform;
  }

  export interface ComponentNode extends FrameNode {
    // A mapping of name to
    // default: {}
    componentPropertyDefinitions?: Record<string, ComponentPropertyDefinition>;
  }

  export interface ComponentSetNode extends FrameNode {
    // A mapping of name to
    // default: {}
    componentPropertyDefinitions?: Record<string, ComponentPropertyDefinition>;

    children: ComponentNode[];
  }

  export interface InstanceNode extends FrameNode {
    // ID of component that this instance came from, refers to
    componentId: string;
    // If true, this node has been marked as exposed to its containing component or component set
    // default: false
    isExposedInstance?: boolean;
    // IDs of instances that have been exposed to this node's level
    // default: []
    exposedInstances?: string[];
    // A mapping of name to
    // default: {}
    componentProperties?: Record<string, ComponentProperty>;
    // An array of all of the fields directly overridden on this instance. Inherited overrides are not included.
    // default: []
    overrides?: Overrides[];
  }

  export interface StickyNode extends Node {
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // If true, author name is visible.
    // default: false
    authorVisible?: boolean;
    // [DEPRECATED] Background color of the node. This is deprecated, please use the fills field instead.
    backgroundColor: Color;
    // How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blendMode: BlendMode;
    // Text contained within a text box
    characters: string;
    // An array of effects attached to this node (see effects section for more details)
    // default: []
    effects?: Effect[];
    // An array of export settings representing images to export from the node
    // default: []
    exportSettings?: ExportSetting[];
    // An array of fill paints applied to the node
    // default: []
    fills?: Paint[];
    // If true, sticky is locked and cannot be edited
    // default: false
    locked?: boolean;
    // Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
    opacity: number;
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform: Transform;
  }

  export interface ShapeWithTextNode extends Node {
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // Background color of the canvas.
    backgroundColor: Color;
    // How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blendMode: BlendMode;
    // Text contained within a text box
    characters: string;
    // Radius of each corner of the rectangle if a single radius is set for all corners
    cornerRadius: number;
    // Array of length 4 of the radius of each corner of the rectangle, starting in the top left and proceeding clockwise
    rectangleCornerRadii: number[];
    // A value that lets you control how "smooth" the corners are. Ranges from 0 to 1. 0 is the default and means that the corner is perfectly circular. A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape. Other values produce various other curves. See
    cornerSmoothing: number;
    // An array of effects attached to this node (see effects section for more details)
    // default: []
    effects?: Effect[];
    // An array of export settings representing images to export from the node
    // default: []
    exportSettings?: ExportSetting[];
    // An array of fill paints applied to the node
    // default: []
    fills?: Paint[];
    // Does this node mask sibling nodes in front of it?
    // default: false
    isMask?: boolean;
    // If true, shape-with-text is locked and cannot be edited
    // default: false
    locked?: boolean;
    // Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
    opacity: number;
    // Shape-with-text geometric shape type.
    shapeType: ShapeType;
    // An array of stroke paints applied to the node
    // default: []
    strokes?: Paint[];
    // The weight of strokes on the node
    strokeWeight: number;
    // A string enum with value of "NONE", "ROUND", "SQUARE", "LINE_ARROW", or "TRIANGLE_ARROW", describing the end caps of vector paths.
    // default: "NONE"
    strokeCap?: string;
    // A string enum with value of "MITER", "BEVEL", or "ROUND", describing how corners in vector paths are rendered.
    // default: "MITER"
    strokeJoin?: string;
    // An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows. For example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
    // default: []
    strokeDashes?: number[];
    // Position of stroke relative to vector outline, as a string enum
    strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform: Transform;
    // A mapping of a StyleType to style ID (see
    styles: Record<StyleType, string>;
  }

  export interface ConnectorNode extends Node {
    // Bounding box of the node in absolute space coordinates
    absoluteBoundingBox: Rectangle;
    // The bounds of the rendered node in the file in absolute space coordinates
    absoluteRenderBounds: Rectangle;
    // Background color of the canvas.
    backgroundColor: Color;
    // How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blendMode: BlendMode;
    // Text contained within a text box
    characters: string;
    // Connector starting endpoint.
    connectorStart: ConnectorEndpoint;
    // Connector ending endpoint.
    connectorEnd: ConnectorEndpoint;
    // A string enum with value of "NONE", "LINE_ARROW", "TRIANGLE_ARROW", "DIAMOND_FILLED", "CIRCLE_FILLED", or "TRIANGLE_FILLED" describing the end cap of the start of the connector.
    // default: "NONE"
    connectorStartStrokeCap?: string;
    // A string enum with value of "NONE", "LINE_ARROW", "TRIANGLE_ARROW", "DIAMOND_FILLED", "CIRCLE_FILLED", or "TRIANGLE_FILLED" describing the end cap of the end of the connector.
    // default: "NONE"
    connectorEndStrokeCap?: string;
    // Connector line type.
    connectorLineType: ConnectorLineType;
    // Radius of each corner of the rectangle if a single radius is set for all corners
    cornerRadius: number;
    // Array of length 4 of the radius of each corner of the rectangle, starting in the top left and proceeding clockwise
    rectangleCornerRadii: number[];
    // A value that lets you control how "smooth" the corners are. Ranges from 0 to 1. 0 is the default and means that the corner is perfectly circular. A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape. Other values produce various other curves. See
    cornerSmoothing: number;
    // An array of effects attached to this node (see effects section for more details)
    // default: []
    effects?: Effect[];
    // An array of export settings representing images to export from the node
    // default: []
    exportSettings?: ExportSetting[];
    // An array of fill paints applied to the node
    // default: []
    fills?: Paint[];
    // Does this node mask sibling nodes in front of it?
    // default: false
    isMask?: boolean;
    // If true, connector is locked and cannot be edited
    // default: false
    locked?: boolean;
    // Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
    opacity: number;
    // An array of stroke paints applied to the node
    // default: []
    strokes?: Paint[];
    // The weight of strokes on the node
    strokeWeight: number;
    // A string enum with value of "NONE", "ROUND", "SQUARE", "LINE_ARROW", or "TRIANGLE_ARROW", describing the end caps of vector paths.
    // default: "NONE"
    strokeCap?: string;
    // A string enum with value of "MITER", "BEVEL", or "ROUND", describing how corners in vector paths are rendered.
    // default: "MITER"
    strokeJoin?: string;
    // An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows. For example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
    // default: []
    strokeDashes?: number[];
    // Position of stroke relative to vector outline, as a string enum
    strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
    // Connector text background.
    textBackground: ConnectorTextBackground;
    // The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
    relativeTransform: Transform;
    // A mapping of a StyleType to style ID (see
    styles: Record<StyleType, string>;
  }

  export interface WashiTapeNode extends VectorNode {}

  export interface Color {
    // Red channel value, between 0 and 1
    r: number;
    // Green channel value, between 0 and 1
    g: number;
    // Blue channel value, between 0 and 1
    b: number;
    // Alpha channel value, between 0 and 1
    a: number;
  }

  export type ExportSetting = {
    // File suffix to append to all filenames
    suffix: string;
    // Image type, string enum that supports values
    format: "JPG" | "PNG" | "SVG";
    // Constraint that determines sizing of exported asset
    constraint: Constraint;
  };

  export type Constraint = {
    // Type of constraint to apply; string enum with potential values below
    type: "SCALE" | "WIDTH" | "HEIGHT";
    // See
    value: number;
  };

  export type Rectangle = {
    // X coordinate of top left corner of the rectangle
    x: number;
    // Y coordinate of top left corner of the rectangle
    y: number;
    // Width of the rectangle
    width: number;
    // Height of the rectangle
    height: number;
  };

  export type ArcData = {
    // Start of the sweep in radians
    startingAngle: number;
    // End of the sweep in radians
    endingAngle: number;
    // Inner radius value between 0 and 1
    innerRadius: number;
  };

  export type BlendMode =
    | "PASS_THROUGH"
    | "NORMAL"
    | "DARKEN"
    | "MULTIPLY"
    | "LINEAR_BURN"
    | "COLOR_BURN"
    | "LIGHTEN"
    | "SCREEN"
    | "LINEAR_DODGE"
    | "COLOR_DODGE"
    | "OVERLAY"
    | "SOFT_LIGHT"
    | "HARD_LIGHT"
    | "DIFFERENCE"
    | "EXCLUSION"
    | "HUE"
    | "SATURATION"
    | "COLOR"
    | "LUMINOSITY";

  export type MaskType = "ALPHA" | "VECTOR" | "LUMINANCE";

  export type EasingType =
    | "EASE_IN"
    | "EASE_OUT"
    | "EASE_IN_AND_OUT"
    | "LINEAR"
    | "GENTLE_SPRING";

  export type FlowStartingPoint = {
    // Unique identifier specifying the frame
    nodeId: string;
    // Name of flow
    name: string;
  };

  export type LayoutConstraint = {
    // Vertical constraint as an enum
    vertical: "TOP" | "BOTTOM" | "CENTER" | "TOP_BOTTOM" | "SCALE";
    // Horizontal constraint as an enum
    horizontal: "LEFT" | "RIGHT" | "CENTER" | "LEFT_RIGHT" | "SCALE";
  };

  export type LayoutGrid = {
    // Orientation of the grid as a string enum
    pattern: "COLUMNS" | "ROWS" | "GRID";
    // Width of column grid or height of row grid or square grid spacing
    sectionSize: number;
    // Is the grid currently visible?
    visible: boolean;
    // Color of the grid
    color: Color;
    // Positioning of grid as a string enum
    alignment: "MIN" | "STRETCH" | "CENTER";
    // Spacing in between columns and rows
    gutterSize: number;
    // Spacing before the first column or row
    offset: number;
    // Number of columns or rows
    count: number;
  };

  export type EffectType =
    | "INNER_SHADOW"
    | "DROP_SHADOW"
    | "LAYER_BLUR"
    | "BACKGROUND_BLUR";

  export type Effect<T extends EffectType = EffectType> = {
    // Type of effect as a string enum
    type: T;
    // Is the effect active?
    visible: boolean;
    // Radius of the blur effect (applies to shadows as well)
    radius: number;
    // The color of the shadow
    color: Color;
    // Blend mode of the shadow
    blendMode: BlendMode;
    // How far the shadow is projected in the x and y directions
    offset: Vector;
    // How far the shadow spreads
    // default: 0
    spread?: number;
    // Whether to show the shadow behind translucent or transparent pixels (applies only to drop shadows)
    showShadowBehindNode: boolean;
  };

  export type NodeHyperlink = {
    // Type of hyperlink
    type: "NODE";
    // ID of frame hyperlink points to, if NODE type
    nodeID: string;
  };

  export type Hyperlink = {
    // Type of hyperlink
    type: "URL";
    // URL being linked to, if URL type
    url: string;
  };

  export type DocumentationLink = {
    // Should be a valid URI (e.g.
    uri: string;
  };

  export type Paint<
    T extends
      | "SOLID"
      | "GRADIENT_LINEAR"
      | "GRADIENT_RADIAL"
      | "GRADIENT_ANGULAR"
      | "GRADIENT_DIAMOND"
      | "IMAGE"
      | "EMOJI"
      | "VIDEO" =
      | "SOLID"
      | "GRADIENT_LINEAR"
      | "GRADIENT_RADIAL"
      | "GRADIENT_ANGULAR"
      | "GRADIENT_DIAMOND"
      | "IMAGE"
      | "EMOJI"
      | "VIDEO"
  > = {
    // Type of paint as a string enum
    type: T;
    // Is the paint enabled?
    // default: true
    visible?: boolean;
    // Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
    // default: 1
    opacity?: number;
    // Solid color of the paint
    color: Color;
    // How this node blends with nodes behind it in the scene (see blend mode section for more details)
    blendMode?: BlendMode;
    // This field contains three vectors, each of which are a position in normalized object space (normalized object space is if the top left corner of the bounding box of the object is (0, 0) and the bottom right is (1,1)). The first position corresponds to the start of the gradient (value 0 for the purposes of calculating gradient stops), the second position is the end of the gradient (value 1), and the third handle position determines the width of the gradient. See image examples below:
    gradientHandlePositions?: Vector[];
    // Positions of key points along the gradient axis
    // with the colors anchored there. Colors along the gradient
    // are interpolated smoothly between neighboring gradient stops.
    gradientStops?: ColorStop[];
    // Image scaling mode
    scaleMode?: "FILL" | "FIT" | "TILE" | "STRETCH";
    // Affine transform applied to the image, only present if
    imageTransform?: Transform;
    // Amount image is scaled by in tiling, only present if
    scalingFactor?: "TILE";
    // Image rotation, in degrees.
    rotation?: number;
    // A reference to an image embedded in this node. To download the image using this reference, use the images API
    imageRef?: string;
    // Defines what image filters have been applied to this paint, if any. If this property is not defined, no filters have been applied.
    // default: {}
    filters?: ImageFilters;
    // A reference to the GIF embedded in this node, if the image is a GIF. To download the image using this reference, use the
    gifRef?: string;
    // A mapping of field to the
    boundVariables?: Record<string, VariableAlias>;
  };

  export type Vector = {
    // X coordinate of the vector
    x: number;
    // Y coordinate of the vector
    y: number;
  };

  export type Size = {
    // the width of a size
    width: number;
    // the height of a size
    height: number;
  };

  export type Transform = [[number, number, number], [number, number, number]];

  export type ImageFilters = {
    // default: 0
    exposure?: number;
    // default: 0
    contrast?: number;
    // default: 0
    saturation?: number;
    // default: 0
    temperature?: number;
    // default: 0
    tint?: number;
    // default: 0
    highlights?: number;
    // default: 0
    shadows?: number;
  };

  export type FrameOffset = {
    // Unique id specifying the frame.
    node_id: string;
    // 2d vector offset within the frame.
    node_offset: Vector;
  };

  export type ColorStop = {
    // Value between 0 and 1 representing position along gradient axis
    position: number;
    // Color attached to corresponding position
    color: Color;
  };

  export type PaintOverride = {
    // Paints applied to characters
    fills: Paint[];
    // ID of style node, if any, that this inherits fill data from
    inheritFillStyleId: string;
  };

  export type TypeStyle = {
    // Font family of text (standard name)
    fontFamily: string;
    // PostScript font name
    fontPostScriptName: string | null;
    // Space between paragraphs in px, 0 if not present
    // default: 0
    paragraphSpacing?: number;
    // Paragraph indentation in px, 0 if not present
    // default: 0
    paragraphIndent?: number;
    // Space between list items in px, 0 if not present
    // default: 0
    listSpacing?: number;
    // Whether or not text is italicized
    italic?: boolean;
    // Numeric font weight
    fontWeight?: number;
    // Font size in px
    fontSize: number;
    // Text casing applied to the node, default is the original casing
    // default: ORIGINAL
    textCase?: "UPPER" | "LOWER" | "TITLE" | "SMALL_CAPS" | "SMALL_CAPS_FORCED";
    // Text decoration applied to the node, default is none
    // default: NONE
    textDecoration?: "STRIKETHROUGH" | "UNDERLINE";
    // Dimensions along which text will auto resize, default is that the text does not auto-resize. TRUNCATE means that the text will be shortened and trailing text will be replaced with "…" if the text contents is larger than the bounds. TRUNCATE as a return value is deprecated and will be removed in a future version. Read from
    // default: NONE
    textAutoResize?: "HEIGHT" | "WIDTH_AND_HEIGHT" | "[DEPRECATED] TRUNCATE";
    // Whether this text node will truncate with an ellipsis when the text contents is larger than the text node.
    // default: DISABLED
    textTruncation?: "DISABLED" | "ENDING";
    // When
    // default: null
    maxLines?: number;
    // Horizontal text alignment as string enum
    textAlignHorizontal: "LEFT" | "RIGHT" | "CENTER" | "JUSTIFIED";
    // Vertical text alignment as string enum
    textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
    // Space between characters in px
    letterSpacing: number;
    // Paints applied to characters
    fills?: Paint[];
    // Link to a URL or frame
    hyperlink?: Hyperlink | NodeHyperlink;
    // A map of OpenType feature flags to 1 or 0, 1 if it is enabled and 0 if it is disabled. Note that some flags aren't reflected here. For example, SMCP (small caps) is still represented by the textCase field.
    // default: {}
    opentypeFlags?: Record<string, number>;
    // Line height in px
    lineHeightPx: number;
    // Line height as a percentage of normal line height. This is deprecated; in a future version of the API only lineHeightPx and lineHeightPercentFontSize will be returned.
    // default: 100
    lineHeightPercent?: number;
    // Line height as a percentage of the font size. Only returned when lineHeightPercent is not 100.
    lineHeightPercentFontSize?: number;
    // The unit of the line height value specified by the user.
    lineHeightUnit?: "PIXELS" | "FONT_SIZE_%" | "INTRINSIC_%";
  };

  // from files/:file_key or files/:file_key/nodes
  export type ComponentMetadata = {
    // The key of the component
    key: string;
    // The name of the component
    name: string;
    // The description of the component as entered in the editor
    description: string;
    // Whether this component is a remote component that doesn't live in this file
    remote: boolean;
    // The ID of the component set if the component belongs to one
    componentSetId?: string;
    // The documentation links for this component.
    documentationLinks: DocumentationLink[];
  };

  // from :file_key/components
  export type Component = Omit<
    ComponentMetadata,
    "remote" | "documentationLinks"
  > & {
    // File Key
    file_key: string;
    // The node_id in the file
    node_id: string;
    // Thumbnail URL for the component set
    thumbnail_url: string;
    // The description of the component as entered in the editor
    description_rt: string;
    // Dates when the component was created and last modified
    created_at: string;
    updated_at: string;
    // Information about the containing frame of this component
    // This is undocumented in the Figma API
    containing_frame?: ComponentFrameInfo;
  };

  export type ComponentSetMetadata = {
    // The key of the component set
    key: string;
    // The name of the component set
    name: string;
    // The description of the component set as entered in the editor
    description: string;
    // The documentation links for this component set.
    documentationLinks: DocumentationLink[];
  };

  export type ComponentSet = Omit<
    ComponentSetMetadata,
    "documentationLinks"
  > & {
    // File Key
    file_key: string;
    // The node_id in the file
    node_id: string;
    // Thumbnail URL for the component set
    thumbnail_url: string;
    // Dates when the component set was created and last modified
    created_at: string;
    updated_at: string;
    // Information about the containing frame of this component set
    // This is undocumented in the Figma API
    containing_frame?: ComponentSetFrameInfo;
  };

  // This is present in response from the file or nodes API and is slightly different to response to the styles API
  export type StyleMetadata = {
    // The key of the style
    key: string;
    // The name of the style
    name: string;
    // The type of style as string enum
    styleType: StyleType;
    // Whether this style is a remote style that doesn't live in this file
    remote: boolean;
    // The description of the style
    description: string;
  };

  export type Style = {
    // The key of the style
    key: string;
    // File Key
    file_key: string;
    // Node id
    node_id: string;
    // The type of style as string enum
    style_type: StyleType;
    // Thumbnail
    thumbnail_url: string;
    // The name of the style
    name: string;
    // The description of the style
    description: string;
    // Whether this style is a remote style that doesn't live in this file
    remote?: boolean;
    // Dates when the component style was created and last modified
    created_at: string;
    updated_at: string;
    user: {
      // The user's ID
      id: string;
      // The user's handle
      handle: string;
      // Avatar URL
      img_url: string;
    };
    sort_position: string;
  };

  export type ShapeType = {
    SQUARE: string;
    ELLIPSE: string;
    ROUNDED_RECTANGLE: string;
    DIAMOND: string;
    TRIANGLE_DOWN: string;
    PARALLELOGRAM_RIGHT: string;
    PARALLELOGRAM_LEFT: string;
    ENG_DATABASE: string;
    ENG_QUEUE: string;
    ENG_FILE: string;
    ENG_FOLDER: string;
    TRAPEZOID: string;
    PREDEFINED_PROCESS: string;
    SHIELD: string;
    DOCUMENT_SINGLE: string;
    DOCUMENT_MULTIPLE: string;
    MANUAL_INPUT: string;
    HEXAGON: string;
    CHEVRON: string;
    PENTAGON: string;
    OCTAGON: string;
    STAR: string;
    PLUS: string;
    ARROW_LEFT: string;
    ARROW_RIGHT: string;
    SUMMING_JUNCTION: string;
    OR: string;
    SPEECH_BUBBLE: string;
    INTERNAL_STORAGE: string;
  };

  export type ParentLike =
    | Figma.DocumentNode
    | Figma.FrameNode
    | Figma.GroupNode
    | Figma.ComponentNode
    | Figma.ComponentSetNode
    | Figma.InstanceNode;

  export type BoxLike =
    | Figma.FrameNode
    | Figma.GroupNode
    | Figma.SectionNode
    | Figma.ComponentNode
    | Figma.ComponentSetNode
    | Figma.InstanceNode
    | Figma.VectorNode
    | Figma.TextNode
    | Figma.LineNode
    | Figma.EllipseNode
    | Figma.RegularPolygonNode
    | Figma.StarNode
    | Figma.RectangleNode;

  export type FrameLike =
    | Figma.FrameNode
    | Figma.GroupNode
    | Figma.ComponentNode
    | Figma.ComponentSetNode
    | Figma.InstanceNode
    | Figma.RectangleNode;

  export type FlexLike =
    | Figma.FrameNode
    | Figma.GroupNode
    | Figma.ComponentNode
    | Figma.ComponentSetNode
    | Figma.InstanceNode;

  export type SvgLike =
    | Figma.RegularPolygonNode
    | Figma.StarNode
    | Figma.LineNode
    | Figma.EllipseNode
    | Figma.VectorNode
    | Figma.BooleanOperationNode;

  export type FillLike =
    | Figma.FrameNode
    | Figma.SectionNode
    | Figma.GroupNode
    | Figma.VectorNode
    | Figma.TypeStyle
    | Figma.ShapeWithTextNode;

  export type ConnectorEndpoint = {
    // Canvas location as x & y coordinate.
    position: Vector;
    // Node ID this endpoint attaches to.
    endpointNodeId: string;
    // The magnet type is a string enum
    magnet: ConnectorMagnet;
  };

  export type ConnectorLineType = {
    ELBOWED: string;
    STRAIGHT: string;
  };

  export type ConnectorTextBackground = {
    // Radius of each corner of the rectangle if a single radius is set for all corners
    cornerRadius: CornerRadius;
    // An array of fill paints applied to the node
    fills: Paint[];
  };

  export type ComponentPropertyDefinition = {
    // Type of this component property
    type: ComponentPropertyType;
    // Initial value of this property for instances
    defaultValue: boolean | string;
    // All possible values for this property. Only exists on VARIANT properties
    variantOptions?: string[];
    // List of user-defined preferred values for this property. Only exists on INSTANCE_SWAP properties
    preferredValues?: InstanceSwapPreferredValue[];
  };

  export type BooleanPropertyDefinition = {
    // Type of this component property
    type: "BOOLEAN";
    // Initial value of this property for instances
    defaultValue: boolean;
  };

  export type VariantPropertyDefinition = {
    // Type of this component property
    type: "VARIANT";
    // Initial value of this property for instances
    defaultValue: string;
    // All possible values for this property. Only exists on VARIANT properties
    variantOptions: string[];
  };

  export type InstanceSwapPropertyDefinition = {
    // Type of this component property
    type: "INSTANCE_SWAP";
    // List of user-defined preferred values for this property. Only exists on INSTANCE_SWAP properties
    preferredValues?: InstanceSwapPreferredValue[];
  };

  export type ComponentProperty = {
    // Type of this component property
    type: ComponentPropertyType;
    // Value of this property set on this instance
    value: boolean;
    // List of user-defined preferred values for this property. Only exists on INSTANCE_SWAP properties
    preferredValues?: InstanceSwapPreferredValue[];
    // A mapping of field to the
    boundVariables: Record<string, VariableAlias>;
  };

  export type ComponentPropertyType =
    | "BOOLEAN"
    | "INSTANCE_SWAP"
    | "TEXT"
    | "VARIANT";

  export type InstanceSwapPreferredValue = {
    // Type of node for this preferred value
    type: "COMPONENT" | "COMPONENT_SET";
    // Key of this component or component set
    key: string;
  };

  export type PrototypeDevice = {
    type: "NONE";
    size: Size;
    presetIdentifier: string;
    rotation: "NONE";
  };

  export type StrokeWeights = {
    // The top stroke weight
    top: number;
    // The right stroke weight
    right: number;
    // The bottom stroke weight
    bottom: number;
    // The left stroke weight
    left: number;
  };

  export type Overrides = {
    // A unique ID for a node
    id: string;
    // An array of properties
    overriddenFields: string[];
  };

  export type VariableAlias = {
    // Value is always VARIABLE_ALIAS.
    type: "VARIABLE_ALIAS";
    // The id of the variable that the current variable is aliased to. This variable can be a local or remote variable, and both can be retrieved via the GET /v1/files/:file_key/variables/local endpoint.
    id: string;
  };

  export type StyleType = "FILL" | "TEXT" | "EFFECT" | "GRID";

  export type ConnectorMagnet = "AUTO" | "TOP" | "BOTTOM" | "LEFT" | "RIGHT";

  export type Path = {
    windingRule: "NONZERO" | "EVENODD";
    path: string;
  };
  export type CornerRadius = number[];

  export type ComponentSetFrameInfo = {
    // the pageId of the containing frame
    pageId: string;
    // the pageName of the containing frame
    pageName: string;

    // Optional fields based on weird conditions

    // the node_id of the containing frame
    // this is the COMPONENT_SET if the compnent sits directly on the page
    // and is null if the component has no variants and sits directly on the page
    nodeId?: string;
    // the name of the containing frame
    name?: string;
    // the backgroundColor of the containing frame
    backgroundColor?: string;
  };

  export type ComponentFrameInfo = {
    // Also includes information about the component set
    containingStateGroup?: {
      // the node_id of the containing set
      nodeId: string;
      // the name of the containing set
      name: string;
    };
  } & ComponentSetFrameInfo;

  export type VariableFloatScope =
    | "ALL_SCOPES"
    | "TEXT_CONTENT"
    | "WIDTH_HEIGHT"
    | "GAP"
    | "STROKE_FLOAT"
    | "OPACITY"
    | "EFFECT_FLOAT";

  export type VariableColorScope =
    | "ALL_SCOPES"
    | "ALL_FILLS"
    | "FRAME_FILL"
    | "SHAPE_FILL"
    | "TEXT_FILL"
    | "STROKE_COLOR"
    | "EFFECT_COLOR";

  export type VariableResolvedType = "FLOAT" | "COLOR" | "STRING" | "BOOLEAN";

  export type Platform = "WEB" | "ANDROID" | "IOS";

  export interface Variable<
    T extends VariableResolvedType = VariableResolvedType
  > {
    id: string;
    name: string;
    remote: boolean;
    key: string;
    variableCollectionId: string;
    resolvedType: T;
    description: string;
    hiddenFromPublishing: boolean;
    valuesByMode: {
      [mode: string]: boolean | Color | number | string | VariableAlias;
    };
    scopes: T extends "FLOAT"
      ? VariableFloatScope[] | ["ALL_SCOPES"]
      : T extends "COLOR"
      ? VariableColorScope[] | ["ALL_FILLS"] | ["ALL_SCOPES"]
      : never;
    codeSyntax: Partial<Record<Platform, string>>;
  }

  export interface VariableCollectionMode {
    modeId: string;
    name: string;
  }

  export interface VariableCollection {
    defaultModeId: string;
    id: string;
    name: string;
    remote: boolean;
    modes: VariableCollectionMode[];
    key: string;
    hiddenFromPublishing: boolean;
    variableIds: string[];
  }

  // Dev Resources

  export interface DevResource {
    id: string;
    name: string;
    file_key: string;
    url: string;
    node_id: string;
  }

  // For API responses
  export namespace Api {
    //files/{key}
    export interface FilesResult
      extends _FileMeta,
        FileData<Figma.DocumentNode> {}

    //files/{key}/components
    export interface ComponentsResult
      extends _MetaResult<{
        components: Figma.Component[];
      }> {}

    //components/{key}
    export interface ComponentResult extends _MetaResult<Figma.Component> {}

    //files/{key}/component_sets
    export interface ComponentSetsResult
      extends _MetaResult<{
        component_sets: Figma.ComponentSet[];
      }> {}

    //files/{key}/styles
    export interface StylesResult
      extends _MetaResult<{
        styles: Figma.Style[];
      }> {}

    //images/{file_key}?ids=[]
    export interface ImagesResult {
      images: {
        [nodeId: string]: string;
      };
      err: string | null;
      status?: number;
    }
    //images/{file_key}?ids=[]
    export interface ImageFillsResult
      extends _MetaResult<{
        images: {
          [nodeId: string]: string;
        };
      }> {}

    //files/{key}/variables/local
    export interface VariableResult
      extends _MetaResult<{
        variables: {
          [variableId: string]: Variable;
        };
        variableCollections: {
          [variableCollectionId: string]: VariableCollection;
        };
      }> {}

    //files/{key}/nodes
    // default to Figma.CanvasNode for convenience, could be anything and can be a union of all/some node types
    export interface NodesResult<T extends Figma.Node = Figma.CanvasNode>
      extends _FileMeta {
      nodes: {
        [FNodeId: string]: FileData<T>;
      };
    }

    //files/{key}/dev_resources
    export interface DevResourcesResult {
      dev_resources: DevResource[];
    }

    export interface FileData<T extends Figma.Node = Figma.CanvasNode> {
      document: T;
      components: { [nodeId: string]: Figma.ComponentMetadata };
      componentSets: { [nodeId: string]: Figma.ComponentSetMetadata };
      schemaVersion: number;
      styles: {
        [styleName: string]: Figma.StyleMetadata;
      };
    }

    // Private utility types
    export interface _FileMeta {
      name: string;
      lastModified: string;
      thumbnailUrl: string;
      version: string;
      role: string;
      editorType: string;
      linkAccess: string;
    }
    export interface _MetaResult<T extends {}> {
      status?: number;
      error: Boolean;
      meta: T;
    }
  }
}
