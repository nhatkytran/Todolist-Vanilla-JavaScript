"use strict";

const form = document.querySelector("form");
const input = document.querySelector("input");
const list = document.querySelector("ul");

const app = (function () {
  const cars = localStorage.getItem("cars")
    ? JSON.parse(localStorage.getItem("cars"))
    : [];

  return {
    updatingIndex: null,
    setData() {
      localStorage.setItem("cars", JSON.stringify(cars));
    },
    add(car) {
      cars.push(car);
    },
    delete(index) {
      cars.splice(index, 1);
    },
    handleDelete(event) {
      const deleteButton = event.target.closest(".delete");

      if (!deleteButton) return;

      const index = Number.parseInt(deleteButton.dataset.index);

      this.delete(index);
      this.render();
      this.setData();
    },
    handleUpdate(event) {
      const updateButton = event.target.closest(".update");

      if (!updateButton) return;

      this.updatingIndex = Number.parseInt(updateButton.dataset.index);

      this.render(true, this.updatingIndex);
      input.value = cars[this.updatingIndex];
      input.focus();
    },
    commitUpdate() {
      if (input.value) {
        cars[this.updatingIndex] = input.value;
        this.updatingIndex = null;
        input.value = "";
        this.render();
        this.setData();
      } else {
        this.delete(this.updatingIndex);
        this.updatingIndex = null;
        this.render();
        this.setData();
      }
    },
    render(update = false, itemBeingUpdated = null) {
      let html;

      if (update) {
        const button = form.querySelector("button");
        button.textContent = "Update";
        button.name = "update-button";

        html = cars
          .map((car, index) => {
            return `<li style="margin-bottom: 10px; ${
              index === itemBeingUpdated ? "color: blue" : ""
            }">
                    ${car} ${index === itemBeingUpdated ? "(Updating...)" : ""}
                  </li>`;
          })
          .join("");
      } else {
        html = cars
          .map((car, index) => {
            return `<li style="margin-bottom: 10px">
                    ${car}
                    <button class="delete" data-index="${index}">X</button>
                    <button class="update" data-index="${index}">Update</button>
                  </li>`;
          })
          .join("");
      }

      list.innerHTML = html;
    },
    reset() {
      input.value = null;
      input.focus();
    },
    init() {
      // Add car
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const button = event.target.querySelector("button");

        if (button.name === "add-button") {
          if (!input.value) return;

          this.add(input.value);
          this.render();
          this.setData();
          this.reset();
        }

        if (button.name === "update-button") {
          this.commitUpdate();
        }
      });

      // Update car
      list.addEventListener("click", this.handleUpdate.bind(this));

      // Delete car
      list.addEventListener("click", this.handleDelete.bind(this));

      // Initialize
      this.render();
    },
  };
})();

app.init();
