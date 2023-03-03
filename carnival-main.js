import { defs, tiny } from "./examples/common.js";
import { Gouraud_Shader, Ring_Shader } from "./shaders.js";
import Booth from "./thingamabobs/booth.js";
import Balloon from "./thingamabobs/balloon.js";
import FerrisWheel from "./thingamabobs/ferris-wheel.js";
import Dart from "./thingamabobs/darts.js";

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

export class Carnival extends Scene {
  constructor() {
    // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
    super();

    this.balloon = new Balloon();
    this.dart = new Dart();

    // At the beginning of our program, load one of each of these shape definitions onto the GPU.
    this.shapes = {
      torus: new defs.Torus(15, 15),
      torus2: new defs.Torus(3, 15),
      sphere: new defs.Subdivision_Sphere(4),
      circle: new defs.Regular_2D_Polygon(1, 15),
      skybox: new defs.Cube(),
      floor: new defs.Cube(),
    };

    // *** Materials
    this.materials = {
      skybox: new Material(new defs.Phong_Shader(), {
        ambient: 1,
        diffusivity: 1,
        color: hex_color("#87CEEB"),
      }),
      floor: new Material(new defs.Phong_Shader(), {
        ambient: 1,
        diffusivity: 1,
        color: hex_color("#7CFC00"),
      }),
    };

    this.initial_camera_location = Mat4.look_at(
      vec3(0, 10, 20),
      vec3(0, 0, 0),
      vec3(0, 1, 0)
    );

    this.balloon = new Balloon();
    this.booth = new Booth();
    this.ferrisWheel = new FerrisWheel();
  }
  make_control_panel() {
    // maybe add a "play darts game" button for each game we implement that zooms you into view
    // then once you're in the game the buttons available change? like if you're in the darts game then we make a set of controls appear specifically for that game
    // then when you leave the game those controls disappear
    // same for if we make it so you can ride the ferris wheel
  }

  display(context, program_state) {
    // display():  Called once per frame of animation.
    // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
    if (!context.scratchpad.controls) {
      this.children.push(
        (context.scratchpad.controls = new defs.Movement_Controls())
      );
      // Define the global camera and projection matrices, which are stored in program_state.
      program_state.set_camera(this.initial_camera_location);
    }

    program_state.projection_transform = Mat4.perspective(
      Math.PI / 4,
      context.width / context.height,
      0.1,
      1000
    );
    // lighting
    const light_position = vec4(0, 0, 0, 1);
    // The parameters of the Light are: position, color, size
    program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

    // const t = program_state.animation_time / 1000,
    //   dt = program_state.animation_delta_time / 1000;

    // let model_transform = Mat4.identity();
    //=============================================== skybox =============================================
    let skybox_transform = Mat4.scale(60, 40, 60);
    this.shapes.skybox.draw(
      context,
      program_state,
      skybox_transform,
      this.materials.skybox
    );
    //=============================================== floor =============================================
    let floor_transform = Mat4.scale(60, 0.5, 60);
    this.shapes.floor.draw(
      context,
      program_state,
      floor_transform,
      this.materials.floor
    );

    this.booth.draw(context, program_state);
    this.balloon.draw(
      context,
      program_state,
      Mat4.translation(0, 3.2, 0.2),
      hex_color("#006400")
    );
    this.balloon.draw(
      context,
      program_state,
      Mat4.translation(1.1, 3.2, 0.2),
      hex_color("#ffff00")
    );
    this.balloon.draw(
      context,
      program_state,
      Mat4.translation(2.2, 3.2, 0.2),
      hex_color("#a020f0")
    );
    this.balloon.draw(
      context,
      program_state,
      Mat4.translation(-1.1, 3.2, 0.2),
      hex_color("#ffa500")
    );
    this.balloon.draw(
      context,
      program_state,
      Mat4.translation(-2.2, 3.2, 0.2),
      hex_color("#ff69b4")
    );
    this.dart.draw(
      context,
      program_state,
      Mat4.translation(-7, 3.2, 0.2),
      hex_color("#ff0000")
    );
  }
}
