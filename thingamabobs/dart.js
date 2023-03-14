import { defs, tiny } from "../examples/common.js";
import { Ring_Shader } from "../shaders.js";
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

export default class Dart {
  constructor(location, color) {
    this.shader = new defs.Phong_Shader();

    this.shapes = {
      tip: new defs.Rounded_Closed_Cone(50, 50),
      shaft: new defs.Subdivision_Sphere(5),
      flight: new defs.Rounded_Closed_Cone(50, 50),
    };

    this.default_transforms = {
      tip: Mat4.scale(0.12, 0.12, 0.12)
        .times(Mat4.translation(0, 0, -4))
        .times(Mat4.rotation(Math.PI, 1, 0, 0)),
      shaft: Mat4.scale(0.1, 0.1, 0.6),
      flight: Mat4.scale(0.2, 0.2, 0.2)
        .times(Mat4.translation(0, 0, 3))
        .times(Mat4.rotation(Math.PI, 1, 0, 0)),
    };

    this.color = color;
    this.update_location(location);

    this.bounding_volume = new defs.Subdivision_Sphere(2);
    this.leeway = 0.1;

    this.wireframe_color = new Material(this.shader, {
      color: hex_color("#ffffff"),
      ambient: 1,
    });
  }

  update_location(location) {
    this.location = location;
    this.location_and_transform = this.location.times(
      this.default_transforms.shaft
    );
  }

  draw(context, program_state, location) {
    this.update_location(location);
    const tip_transform = this.location.times(this.default_transforms.tip);
    const shaft_transform = this.location.times(this.default_transforms.shaft);
    const flight_transform = this.location.times(
      this.default_transforms.flight
    );
    const shaft_material = new Material(this.shader, {
      ambient: 1,
      color: this.color,
    });
    const tip_material = new Material(this.shader, {
      ambient: 0.8,
      color: this.color,
    });

    this.shapes.tip.draw(context, program_state, tip_transform, tip_material);
    this.shapes.shaft.draw(
      context,
      program_state,
      shaft_transform,
      shaft_material
    );
    this.shapes.flight.draw(
      context,
      program_state,
      flight_transform,
      tip_material
    );

    /**
     * Draw bounding volume for debugging
     */
    // const size = vec3(1 + this.leeway, 1 + this.leeway, 1 + this.leeway);
    // this.bounding_volume.draw(
    //   context,
    //   program_state,
    //   this.location_and_transform.times(Mat4.scale(...size)),
    //   this.wireframe_color,
    //   "LINE_STRIP"
    // );
  }
}
