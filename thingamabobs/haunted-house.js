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

export default class HauntedHouse {
    shader = new defs.Phong_Shader();
    shapes = {
        tunnel: new defs.Cylindrical_Tube(50,50),   // could this somehow make a hole in the square?
        base: new defs.Cube(),
        // roof: see if can make square pyramid
        chimney: new defs.Cube(),
    }
    materials = {
        base: new Material(new defs.Phong_Shader(), {
            ambient: 1,
            diffusivity: 1,
            color: hex_color("#301934"),
          }),
    }
    constructor();
    draw(context, program_state) {

    }

}