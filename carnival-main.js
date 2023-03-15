import { defs, tiny } from "./examples/common.js";
import { Gouraud_Shader, Ring_Shader } from "./shaders.js";
import Booth from "./thingamabobs/booth.js";
import Balloon from "./thingamabobs/balloon.js";
import FerrisWheel from "./thingamabobs/ferris-wheel.js";
import Dart from "./thingamabobs/dart.js";
import Basketball from "./thingamabobs/basketball.js";

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
      vec3(0, 3, 25),
      vec3(0, 3, 0),
      vec3(0, 1, 0)
    );

    this.booth = new Booth();
    this.ferrisWheel = new FerrisWheel();
   // this.basketball = new Basketball();

    this.balloons = [
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(0, 3.2, 0.2),
          hex_color("#006400")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(1.1, 3.2, 0.2),
          hex_color("#ffff00")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(2.2, 3.2, 0.2),
          hex_color("#a020f0")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(-1.1, 3.2, 0.2),
          hex_color("#ffa500")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(-2.2, 3.2, 0.2),
          hex_color("#ff69b4")
        ),
      },
    ];
    this.dart = new Dart(
      Mat4.translation(0, -1, -5).times(this.initial_camera_location),
      hex_color("#ff0000")
    );
    this.basketball = new Basketball(
      Mat4.translation(0, -1, -5).times(this.initial_camera_location),
      hex_color("#ff0000")
    );

    this.toss = false;
    this.elapsed_seconds = 0;
    this.visible_dart = false;
    this.throw_bb = false;
    this.dt_bb = 0;
    this.visible_bb = false;
    this.velocity = 4;
  }

  make_control_panel() {
    // maybe add a "play darts game" button for each game we implement that zooms you into view
    // then once you're in the game the buttons available change? like if you're in the darts game then we make a set of controls appear specifically for that game
    // then when you leave the game those controls disappear
    // same for if we make it so you can ride the ferris wheel
    this.key_triggered_button("Throw the dart", ["t"], () => {
      this.toss = !this.toss;
      this.tossed_at = this.elapsed_seconds;
      this.starting_dart_position = Mat4.translation(0, -1, -5).times(
        this.program_state.camera_transform
      );
    });
    this.key_triggered_button("Play darts", ["x"], () => {
      this.visible_dart = !this.visible_dart;
    });
    this.key_triggered_button("Throw the basketball", ["b"], () => {
      this.throw_bb = !this.throw_bb;
      this.dt_bb = 0;
      this.bb_tossed_at = this.elapsed_seconds;
      this.starting_bb_position = Mat4.translation(0, -1, -5).times(
        this.program_state.camera_transform
      );
      // this.starting_bb_position = Mat4.translation(0, -1, -5).times(
      //   this.program_state.camera_transform
      // );
    });
    this.key_triggered_button("Play basketball", ["y"], () => {
      this.visible_bb = true;
      this.dt_bb = 0;
      this.throw_bb = false;
    });
    this.key_triggered_button("More powerful basketball throw", ["m"], () => {
      this.velocity = this.velocity + 0.5;
    });
    this.key_triggered_button("Less powerful basketball throw", ["l"], () => {
      this.velocity = this.velocity - 0.5;
    });
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

    const elapsed_seconds = program_state.animation_time / 1000;
    // TODO: This is a silly little hack for sharing state with the toss keyboard trigger
    // Please only use as a prototype
    this.elapsed_seconds = elapsed_seconds;
    this.program_state = program_state;

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

    const t = program_state.animation_time / 1000;
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
    
    this.ferrisWheel.draw(context, program_state);
    this.booth.draw(context, program_state);

//    this.basketball.draw(context, program_state);

    //=============================================== basketball =============================================
    const gravity = -1.9;
    const init_height = 0;
   // const velocity = 4;
    const dt = program_state.animation_delta_time / 1000;
    console.log("this.throw_bb: " + this.throw_bb);

    // if (this.throw_bb) {
    //   this.basketball.draw(
    //     context,
    //     program_state,
    //   );
    // }
    // ball_transform = (Mat4.translation(this.time_bb, ball_y, 10)).times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.rotation(this.time_bb, 0, 0, 1)).times(ball_transform);    // T * S * R * I
    if (this.throw_bb)
    {
      this.dt_bb = this.dt_bb + dt;
    }
    let ball_y = init_height + this.velocity*this.dt_bb + 0.5*gravity*this.dt_bb*this.dt_bb;
    if (this.visible_bb) {
      this.basketball.draw(
          context,
          program_state,
          this.throw_bb
            ? Mat4.translation(
                0,
                ball_y,
                -(this.elapsed_seconds - this.bb_tossed_at) * 6
              ).times(this.starting_bb_position)
            : Mat4.translation(0, -1, -5).times(program_state.camera_transform)
        );
    }

    //=============================================== balloon =============================================

    for (const balloonState of this.balloons) {
      if (balloonState.balloon.collides_with(this.dart)) {
        balloonState.popped = true;
      } else if (!balloonState.popped) {
        balloonState.balloon.draw(context, program_state);
      }
    }

    //=============================================== dart =============================================
    const dart_score = this.balloons.reduce(
      (accumulator, current) => accumulator + current.popped,
      0
    );
    console.log(`Dart score: ${dart_score}`);

    this.dart.draw(
      context,
      program_state,
      this.toss
        ? Mat4.translation(
            0,
            0,
            -(this.elapsed_seconds - this.tossed_at) * 5
          ).times(this.starting_dart_position)
        : Mat4.translation(0, -1, -5).times(program_state.camera_transform)
    );
  }
}
