import { defs, tiny } from "./examples/common.js";
import { Gouraud_Shader, Ring_Shader } from "./shaders.js";
import Booth from "./thingamabobs/booth.js";
import Balloon from "./thingamabobs/balloon.js";
import FerrisWheel from "./thingamabobs/ferris-wheel.js";
import Dart from "./thingamabobs/dart.js";
import ScoreBoard from "./thingamabobs/scoreboard.js";
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
  Texture,
} = tiny;

const { Cube, Textured_Phong } = defs;

class Scaled_Cube extends Cube {
  constructor() {
    super();
    for (let i = 0; i < this.arrays.texture_coord.length; i++)
      this.arrays.texture_coord[i].scale_by(5);
  }
}

export class Carnival extends Scene {
  constructor() {
    // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
    super();

    // At the beginning of our program, load one of each of these shape definitions onto the GPU.
    this.shapes = {
      torus: new defs.Torus(15, 15),
      torus2: new defs.Torus(3, 15),
      sphere: new defs.Subdivision_Sphere(8),
      circle: new defs.Regular_2D_Polygon(1, 15),
      skybox: new defs.Cube(),
      floor: new Scaled_Cube(),
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
        specularity: 0,
        color: hex_color("#7EC850"),
      }),
      sun: new Material(new defs.Phong_Shader(), {
        ambient: 1,
        diffusivity: 1,
        specularity: 1,
        color: hex_color("#FFE87C"),
      }),
      floor2: new Material(new Textured_Phong(), {
        color: hex_color("#000000"),
        ambient: 1,
        diffusivity: 0.1,
        specularity: 0.1,
        texture: new Texture("assets/grass.png", "NEAREST"),
      }),
    };

    this.initial_camera_location = Mat4.look_at(
      vec3(0, 3, 25),
      vec3(0, 3, 0),
      vec3(0, 1, 0)
    );

    this.booth = new Booth();
    this.ferrisWheel = new FerrisWheel();
    this.scoreboard = new ScoreBoard(Mat4.translation(-10, 3, 0));
    // this.basketball = new Basketball();

    this.balloons = [
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(-5, 3.2, 0.2),
          hex_color("#006400")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(-3.9, 3.2, 0.2),
          hex_color("#ffff00")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(-2.8, 3.2, 0.2),
          hex_color("#a020f0")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(-6.1, 3.2, 0.2),
          hex_color("#ffa500")
        ),
      },
      {
        popped: false,
        balloon: new Balloon(
          Mat4.translation(-7.2, 3.2, 0.2),
          hex_color("#ff69b4")
        ),
      },
    ];
    this.darts = [
      {
        dart: new Dart(
          Mat4.translation(0, -1, -5).times(this.initial_camera_location),
          hex_color("#ff0000")
        ),
        visible: false,
      },
      {
        dart: new Dart(
          Mat4.translation(0, -1, -5).times(this.initial_camera_location),
          hex_color("#CFBFAF")
        ),
        visible: false,
      },
      {
        dart: new Dart(
          Mat4.translation(0, -1, -5).times(this.initial_camera_location),
          hex_color("#077DDF")
        ),
        visible: false,
      },
      {
        dart: new Dart(
          Mat4.translation(0, -1, -5).times(this.initial_camera_location),
          hex_color("#F6D003")
        ),
        visible: false,
      },
      {
        dart: new Dart(
          Mat4.translation(0, -1, -5).times(this.initial_camera_location),
          hex_color("#F2337B")
        ),
        visible: false,
      },
    ];
    this.dart_num = 0;
    this.basketball = new Basketball(
      Mat4.translation(0, -1, -5).times(this.initial_camera_location),
      hex_color("#ff0000")
    );

    this.toss = false;
    this.elapsed_seconds = 0;
    this.first_dart = true;
    this.throw_bb = false;
    this.dt_bb = 0;
    this.visible_bb = false;
    this.velocity = 4;
  }

  make_control_panel() {
    this.key_triggered_button("Throw the dart", ["t"], () => {
      // if (!this.first_dart) {
      //   this.dart_num += 1;
      // } else {
      //   this.first_dart = false;
      // }  // I think we need this if statement here (without breaking it tho)
      // We need some sort of thing to initialize position of each dart or something
      if (this.dart_num == 4) {
        this.dart_num = 0;
        this.first_dart = true;
      }
      this.toss = !this.toss;
      this.tossed_at = this.elapsed_seconds;
      this.starting_dart_position = Mat4.translation(0, -1, -5).times(
        this.program_state.camera_transform
      );
    });
    this.key_triggered_button("Play darts", ["x"], () => {
      this.toss = false;
      if (!this.first_dart) {
        this.dart_num += 1;
      } else {
        this.first_dart = false;
      }
      if (this.dart_num > 4) {
        this.dart_num = 0;
      }
      this.darts[this.dart_num].visible = true;
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

    //=============================================== skybox & sun =============================================
    let skybox_transform = Mat4.scale(60, 40, 60);
    this.shapes.skybox.draw(
      context,
      program_state,
      skybox_transform,
      this.materials.skybox
    );
    let sun_transform = Mat4.translation(45, 36, -40).times(
      Mat4.scale(4, 4, 4)
    );
    this.shapes.sphere.draw(
      context,
      program_state,
      sun_transform,
      this.materials.sun
    );

    //=============================================== floor =============================================
    let floor_transform = Mat4.scale(60, 0.5, 60);
    this.shapes.floor.draw(
      context,
      program_state,
      floor_transform,
      this.materials.floor2
    );

    this.ferrisWheel.draw(context, program_state);
    this.booth.draw(context, program_state);

    //    this.basketball.draw(context, program_state);

    //=============================================== basketball =============================================
    const gravity = -1.9;
    const init_height = 0;
    // const velocity = 4;
    const dt = program_state.animation_delta_time / 1000;

    // if (this.throw_bb) {
    //   this.basketball.draw(
    //     context,
    //     program_state,
    //   );
    // }
    // ball_transform = (Mat4.translation(this.time_bb, ball_y, 10)).times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.rotation(this.time_bb, 0, 0, 1)).times(ball_transform);    // T * S * R * I
    if (this.throw_bb) {
      this.dt_bb = this.dt_bb + dt;
    }
    let ball_y =
      init_height +
      this.velocity * this.dt_bb +
      0.5 * gravity * this.dt_bb * this.dt_bb;
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

    const current_dart = this.darts[this.dart_num];
    for (const balloonState of this.balloons) {
      if (balloonState.popped) {
        // don't check collisions if balloon is already popped
        continue;
      }
      if (
        !balloonState.popped &&
        balloonState.balloon.collides_with(current_dart.dart)
      ) {
        balloonState.popped = true;
        current_dart.visible = false;
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
    if (current_dart.visible) {
      current_dart.dart.draw(
        context,
        program_state,
        this.toss
          ? Mat4.translation(
              0,
              0,
              -(this.elapsed_seconds - this.tossed_at) * 15
            ).times(this.starting_dart_position)
          : Mat4.translation(0, -1, -5).times(program_state.camera_transform)
      );
    }

    this.scoreboard.draw(context, program_state, dart_score);
  }
}
