import { Text_Line } from "../examples/text-demo.js";
import { defs, tiny } from "../examples/common.js";

const {
  vec3,
  unsafe3,
  vec4,
  color,
  hex_color,
  Mat4,
  Light,
  Shape,
  Material,
  Shader,
  Texture,
  Scene,
} = tiny;

export default class ScoreBoard {
  constructor(location) {
    this.board_width = 0.1;
    this.text = new Text_Line(1);
    this.materials = {
      board: new Material(new defs.Textured_Phong(), {
        color: hex_color("#000000"),
        ambient: 1,
        texture: new Texture("assets/scoreboard.png"),
      }),
      text_image: new Material(new defs.Textured_Phong(), {
        color: hex_color("#ff0000"),
        ambient: 1,
        texture: new Texture("assets/text.png"),
      }),
    };
    this.board = new defs.Cube();
    this.transform = location.times(Mat4.scale(1, 1, this.board_width));
    this.location = location;
  }

  draw(context, program_state, score) {
    this.board.draw(
      context,
      program_state,
      this.transform,
      this.materials.board
    );
    this.text.set_string(`${score}`, context.context);
    this.text.draw(
      context,
      program_state,
      this.location.times(Mat4.translation(0, 0, this.board_width + 0.01)),
      this.materials.text_image
    );
  }
}
