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
  shader = new defs.Phong_Shader();

  shapes = {
    body: new defs.Subdivision_Sphere(5),
    neck: new defs.Rounded_Closed_Cone(50, 50),
  };

  default_transforms = {
    body: Mat4.scale(0.5, 0.6, 0.5),
    neck: Mat4.scale(0.05, 0.05, 0.05)
      .times(Mat4.translation(0, -12, 0))
      .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0)),
  };

  constructor() {
    this.shader = new defs.Phong_Shader();
  }

  draw(context, program_state, location, color) {
    const body_transform = location.times(this.default_transforms.body);
    const neck_transform = location.times(this.default_transforms.neck);
    const body_material = new Material(this.shader, {
      ambient: 1,
      color,
    });
    const neck_material = new Material(this.shader, {
      ambient: 0.8,
      color,
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
  }
}
