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
  return Math.round(x * 100) / 100;
}

function predictAndCompare(model, inputs, refOutputs) {
  cy.wrap(
    model.predict(inputs).then((outputs) => {
      assert.equal(outputs.length, refOutputs.length);

      for (let i = 0; i < outputs.length; i++) {
        assert.deepEqual(
          Array.from(outputs[i].data).map(round),
          refOutputs[i].data.map(round)
        );
        assert.deepEqual(outputs[i].shape, refOutputs[i].shape);
      }
    })
  );
}

it("can run ONNX model (no options)", () => {
  cy.visit("/quality/tests/index.html");

  cy.window().then((window) => {
    const tractjs = window.tractjs;

    get_data(window, "simple_onnx").then(([refInputs, refOutputs]) => {
      const model = new tractjs.Model(
        "/quality/models/data/squeezenet_1_1/model.onnx"
      );

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

it("can run TF model (with input facts)", () => {
  cy.visit("/quality/tests/index.html");

  cy.window().then((window) => {
    const tractjs = window.tractjs;

    get_data(window, "simple_tf").then(([refInputs, refOutputs]) => {
      const model = new tractjs.Model(
        "/quality/models/data/squeezenet_1_1/model.pb",
        {
          inputFacts: {
            0: ["float32", [1, 227, 227, 3]],
          },
        }
      );

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
