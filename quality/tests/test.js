function get_data(window, name) {
  return cy
    .exec(
      `cargo run --bin test_reference -- ${name} ../quality/tests/inputs.json ../quality/tests/outputs.json`
    )
    .then(() => {
      return Promise.all([
        fetch("/quality/tests/inputs.json").then((response) => response.json()),
        fetch("/quality/tests/outputs.json").then((response) =>
          response.json()
        ),
      ]);
    });
}

function round(x) {
  return Math.round(x * 200) / 200;
}

function predictAndCompare(model, inputs, refOutputs) {
  cy.wrap(
    model.predict(inputs).then((outputs) => {
      assert.equal(outputs.length, refOutputs.length);

      for (let i = 0; i < outputs.length; i++) {
        assert.equal(outputs[i].data.length, refOutputs[i].data.length);
        assert.deepEqual(outputs[i].shape, refOutputs[i].shape);

        for (let j = 0; j < outputs[i].data; j++) {
          assert.equal(round(outputs[i].data[j], round(refOutputs[i].data[j])));
        }
      }
    })
  );
}

it("can run ONNX model (no options)", () => {
  cy.visit("/quality/tests/index.html");

  cy.window().then((window) => {
    const tractjs = window.tractjs;

    get_data(window, "simple_onnx").then(([refInputs, refOutputs]) => {
      tractjs
        .load("/quality/models/data/squeezenet_1_1/model.onnx")
        .then((model) => {
          const inputs = refInputs.map((refInput) => {
            return new tractjs.Tensor(
              new Float32Array(refInput.data),
              refInput.shape
            );
          });

          predictAndCompare(model, inputs, refOutputs);
        });
    });
  });
});

it("can run TF model (with input facts)", () => {
  cy.visit("/quality/tests/index.html");

  cy.window().then((window) => {
    const tractjs = window.tractjs;

    get_data(window, "simple_tf").then(([refInputs, refOutputs]) => {
      tractjs
        .load("/quality/models/data/squeezenet_1_1/model.pb", {
          inputFacts: {
            0: ["float32", [1, 227, 227, 3]],
          },
        })
        .then((model) => {
          const inputs = refInputs.map((refInput) => {
            return new tractjs.Tensor(
              new Float32Array(refInput.data),
              refInput.shape
            );
          });

          predictAndCompare(model, inputs, refOutputs);
        });
    });
  });
});

it("can run ONNX model (with custom outputs)", () => {
  cy.visit("/quality/tests/index.html");

  cy.window().then((window) => {
    const tractjs = window.tractjs;

    get_data(window, "custom_output_onnx").then(([refInputs, refOutputs]) => {
      tractjs
        .load("/quality/models/data/squeezenet_1_1/model.onnx", {
          outputs: ["squeezenet0_conv8_fwd", "squeezenet0_conv9_fwd"],
        })
        .then((model) => {
          const inputs = refInputs.map((refInput) => {
            return new tractjs.Tensor(
              new Float32Array(refInput.data),
              refInput.shape
            );
          });

          predictAndCompare(model, inputs, refOutputs);
        });
    });
  });
});

it("can run TF model (with custom inputs)", () => {
  cy.visit("/quality/tests/index.html");

  cy.window().then((window) => {
    const tractjs = window.tractjs;

    get_data(window, "custom_input_tf").then(([refInputs, refOutputs]) => {
      tractjs
        .load("/quality/models/data/squeezenet_1_1/model.pb", {
          inputFacts: {
            0: ["float32", [1, 227, 227, 3]],
          },
          inputs: ["fire5/relu_expand1x1/Relu", "fire5/relu_expand3x3/Relu"],
        })
        .then((model) => {
          const inputs = refInputs.map((refInput) => {
            return new tractjs.Tensor(
              new Float32Array(refInput.data),
              refInput.shape
            );
          });

          predictAndCompare(model, inputs, refOutputs);
        });
    });
  });
});
