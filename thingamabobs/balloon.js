import { defs, tiny } from "../examples/common.js";

const {
  Vector,
  Vector3,
  vec,
  vec3,
  vec4,
  color,
  hex_color,
  Shader,
  Matrix,
  Mat4,
  Light,
  Shape,
  Material,
  Scene,
} = tiny;

export default class Balloon {
  constructor(location, color) {
    this.shader = new defs.Phong_Shader();

    this.shapes = {
      body: new defs.Subdivision_Sphere(5),
      neck: new defs.Rounded_Closed_Cone(50, 50),
    };

    this.default_transforms = {
      body: Mat4.scale(0.5, 0.6, 0.5),
      neck: Mat4.scale(0.05, 0.05, 0.05)
        .times(Mat4.translation(0, -12, 0))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0)),
    };

    this.bounding_volume = new defs.Subdivision_Sphere(2);
    this.leeway = 0.1;

    this.location = location;
    this.color = color;
    this.location_and_transform = this.location.times(
      this.default_transforms.body
    );

    this.wireframe_color = new Material(this.shader, {
      color: hex_color("#ffffff"),
      ambient: 1,
    });
  }

  draw(context, program_state) {
    const body_transform = this.location.times(this.default_transforms.body);
    const neck_transform = this.location.times(this.default_transforms.neck);
    const body_material = new Material(this.shader, {
      ambient: 1,
      color: this.color,
    });
    const neck_material = new Material(this.shader, {
      ambient: 0.8,
      color: this.color,
    });

    this.shapes.body.draw(
      context,
      program_state,
      body_transform,
      body_material
    );
    this.shapes.neck.draw(
      context,
      program_state,
      neck_transform,
      neck_material
    );

    /**
     * Draw bounding volume for debugging
     */
    const size = vec3(1 + this.leeway, 1 + this.leeway, 1 + this.leeway);
    this.bounding_volume.draw(
      context,
      program_state,
      this.location_and_transform.times(Mat4.scale(...size)),
      this.wireframe_color,
      "LINE_STRIP"
    );
  }

  collides_with(other) {
    // Cannot collide with itself
    if (Object.is(this, other)) {
      return false;
    }

    function intersect_sphere(p, margin = 0) {
      return p.dot(p) < 1 + margin;
    }

    // `other` object must have a location_and_transform property
    if (other.location_and_transform != null) {
      const T = Mat4.inverse(this.location_and_transform).times(
        other.location_and_transform,
        Mat4.identity()
      );

      return this.bounding_volume.arrays.position.some((point) =>
        intersect_sphere(T.times(point.to4(1)).to3(), this.leeway)
      );
    }

    return false;
  }
}
