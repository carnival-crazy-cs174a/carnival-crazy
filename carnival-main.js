import { defs, tiny } from "./examples/common.js";
import { Gouraud_Shader, Ring_Shader } from "./shaders.js";
import Booths from "./thingamabobs/booths.js";
import Balloon from "./thingamabobs/balloon.js";
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
      roof: new defs.Closed_Cone(15, 15),
      poles: new defs.Rounded_Capped_Cylinder(500, 500),
      table: new defs.Cube(),
    };

    // *** Materials
    this.materials = {
      poles: new Material(new defs.Phong_Shader(), {
        ambient: 0.4,
        diffusivity: 0.6,
        color: hex_color("#FFFFFF"),
      }),
      test2: new Material(new Gouraud_Shader(), {
        ambient: 0.4,
        diffusivity: 0.6,
        color: hex_color("#992828"),
      }),
      red_ring_roof: new Material(new Ring_Shader(), {
        ambient: 0,
        diffusivity: 1,
        specularity: 1,
        color: hex_color("#FF0000"),
      }),
      red_table: new Material(new defs.Phong_Shader(), {
        ambient: 1,
        diffusivity: 1,
        color: hex_color("#CF0000"),
      }),
      blue: new Material(new defs.Phong_Shader(), {
        ambient: 1,
        diffusivity: 1,
        color: hex_color("#077DDF"),
      }),
      yellow: new Material(new defs.Phong_Shader(), {
        ambient: 1,
        diffusivity: 1,
        color: hex_color("#F6D003"),
      }),
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
  }

  make_control_panel() {}

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

    const t = program_state.animation_time / 1000,
      dt = program_state.animation_delta_time / 1000;

    let model_transform = Mat4.identity();
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

    Booths(context, program_state, this.shapes, this.materials);
    this.balloon.draw(context, program_state, Mat4.translation(0, 3.2, .2), hex_color("#006400"));
    this.balloon.draw(context, program_state, Mat4.translation(1.1, 3.2, .2), hex_color("#ffff00"));
    this.balloon.draw(context, program_state, Mat4.translation(2.2, 3.2, .2), hex_color("#a020f0"));
    this.balloon.draw(context, program_state, Mat4.translation(-1.1, 3.2, .2), hex_color("#ffa500"));
    this.balloon.draw(context, program_state, Mat4.translation(-2.2, 3.2, .2), hex_color("#ff69b4"));
    this.dart.draw(context, program_state, Mat4.translation(-7, 3.2, .2), hex_color("#ff0000"));
  }
}
