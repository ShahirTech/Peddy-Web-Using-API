// global variables
window.allPetsData = []; // Global variable to hold all pet data
const petsContainer = document.getElementById("allpets");
const noInfo = document.getElementById("no-info");
const modals = document.getElementById("modals");
const categoryContainer = document.getElementById("categories-button");
const buttonContainer = document.createElement("div");
let lastClickedButton = null; // Variable to store the last clicked button
const spin = document.getElementById("loading-spinner");

// load category
const loadCategories = async () => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/categories`
  );
  const data = await res.json();
  displayCategories(data.categories);
};

const displayCategories = (categories) => {
  categories.forEach((item) => {
    const buttonContainer = document.createElement("div");
    const buttonId = `button-${item.category}`; // Unique ID for the button

    buttonContainer.innerHTML = `
  <button id="${buttonId}" onclick="petCategory('${item.category}', this)" class="btn border-[1px] border-[#0E7A8126] w-full font-extrabold lg:h-20 lg:text-lg ${item.category === 'dog' ? 'rounded-full bg-[#0E7A811A] border-[3px] border-[#0E7A81]' : ''}">
    <img class="w-7 lg:w-10 mr-2" src="${item.category_icon}" alt=""> ${item.category}s
  </button>
  `;
  if (item.category === 'Dog') {
    lastClickedButton = buttonContainer.querySelector('button');
  }
    categoryContainer.append(buttonContainer);
  });
};

const petCategory = (category, button) => {

  spin.classList.remove("hidden");
  petsContainer.classList.remove("grid");
  petsContainer.classList.add("hidden");
  noInfo.classList.add("hidden");
    // Remove the rounded-full class from the last clicked button, if it exists
    if (lastClickedButton) {
        lastClickedButton.classList.remove('rounded-full');
        lastClickedButton.classList.remove('bg-[#0E7A811A]');
        lastClickedButton.classList.remove('border-[#0E7A81]');
        lastClickedButton.classList.remove('border-[3px]');
      }
    
      // Add the rounded-full class to the currently clicked button
      button.classList.add('rounded-full');
      button.classList.add("bg-[#0E7A811A]");
      button.classList.add("border-[3px]");
      button.classList.add("border-[#0E7A81]");
    
      // Update the reference to the last clicked button
      lastClickedButton = button;

  

  setTimeout(function () {
    loadAllPets(category);
    spin.classList.add("hidden");
  }, 2000);

};

// Load all pets function
const loadAllPets = async (category) => {
  spin.classList.remove("hidden");

  if (category) {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`);
    const data = await res.json();
    allPetsData = data.data; // Store data for sorting
    displayAllPets(allPetsData);
  } else {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pets`);
    const data = await res.json();
    allPetsData = data.pets; // Store data for sorting
    setTimeout(() => {
      displayAllPets(allPetsData);
      spin.classList.add("hidden");
    }, 2000);
  }
};

// Sort by Price function
const sortPetsByPrice = (pets) => {
  return pets.sort((a, b) => b.price - a.price); // Sort in descending order
};

// Sort button click event
document.getElementById('sort-price').addEventListener('click', () => {
  if (window.allPetsData) {
    const sortedPets = sortPetsByPrice([...window.allPetsData]); // Create a copy and sort
    displayAllPets(sortedPets);
  }
});

const displayAllPets = (data) => {
  petsContainer.innerHTML = "";
  if (data.length === 0) {
    noInfo.classList.remove("hidden");
    petsContainer.classList.remove("grid");
    petsContainer.classList.add("hidden");
  } else {
    noInfo.classList.add("hidden");
    petsContainer.classList.remove("hidden");
    petsContainer.classList.add("grid");
    data.forEach((item) => {
      const allPets = document.createElement("div");
      allPets.innerHTML = `
                        <div
                  class=" card bg-base-100 border-[1px] border-[#1313131A] w-[300px] shadow-xl h-fit"
                >
                  <figure class="px-5 pt-5  h-[173px]">
                    <img
                      src="${item.image}"
                      alt=""
                      class="rounded-xl h-full w-full object-cover"
                    />
                  </figure>
                  <div class="flex flex-col gap-5 p-5">
                    <div class="text-left px-1">
                      <h3 class="font-bold text-xl pb-2">${item.pet_name}</h3>
                      <div class="text-[#131313B3] space-y-1">
                        <p class="">
                          <i class="fa-duotone fa-solid fa-grid-2 fa-lg pr-1"></i>
                          Breed: ${item.breed ? item.breed : "No Info"}
                        </p>
                        <p class="">
                          <i class="fa-light fa-calendar fa-lg pr-2"></i> Birth:
                          ${item.date_of_birth ? item.date_of_birth : "No Info"}
                        </p>
                        <p class="">
                          <i class="fa-regular fa-mercury fa-lg pr-2"></i> Gender:
                          ${item.gender ? item.gender : "No Info"}
                        </p>
                        <p class="">
                          <i class="fa-regular fa-tag fa-lg pr-2"></i> Price : ${
                            item.price ? item.price : "Negotiatable"
                          }$
                        </p>
                      </div>
                    </div>
                    <div
                      class="card-actions justify-center items-center pt-4 border-t-2 space-x-2"
                    >
                      <button onclick="likedPets('${item.image}')"
                        class="btn font-extrabold hover:bg-slate-500 py-0 px-5 border-[#0E7A8126]"
                      >
                        <i
                          class="fa-light fa-thumbs-up fa-bounce fa-lg"
                          style="color: #000000"
                        ></i>
                      </button>
                      <button
                      onclick="adopted(this)"
                        class="btn text-[#0E7A81] hover:bg-slate-500 py-0 px-2 font-bold border-[1px] border-[#0E7A8126]"
                      >
                        Adopt
                      </button>
                      <button onclick="loadPetDetails('${item.petId}')"
                        class="btn text-[#0E7A81] hover:bg-slate-500 py-0 px-5 font-bold border-[#0E7A8126]"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
            `;

      petsContainer.append(allPets);
    });
  }
};

const likedPets = (images) => {
  const likedContainer = document.getElementById("liked-pets");
  likedContainer.classList.remove('h-[158px]')
  const liked = document.createElement("figure");
  liked.innerHTML = `
                <figure class="w-[125px] h-[125px]">
              <img
                src="${images}"
                alt="Shoes"
                class="rounded-xl w-full h-full object-cover"
              />
            </figure>
    `;
  likedContainer.append(liked);
};

const loadPetDetails = async (details) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pet/${details}`
  );
  const data = await res.json();
  showPetDetails(data.petData);
};

const showPetDetails = (data) => {
  const {
    breed,
    pet_name,
    pet_details,
    gender,
    image,
    price,
    date_of_birth,
    vaccinated_status,
  } = data;

  modals.innerHTML = `
    <dialog id="my_modal_1" class="modal w-[85%] mx-auto px-2">
  <div class="modal-box max-w-full lg:w-[700px] w-full ">
    <figure class="px-2 pt-2 h-56 ">
        <img
          src="${image}"
          alt=""
          class="rounded-xl h-full w-full object-fill"
        />
      </figure>
      <div class="flex flex-col gap-5 p-5">
        <div class="text-left px-1">
          <h3 class="font-bold text-xl pb-2">${pet_name}</h3>
          <div class="text-[#131313B3] grid grid-cols-2 space-y-1 text-xs lg:text-base">
            <p class="">
              <i class="fa-duotone fa-solid fa-grid-2 fa-lg pr-1"></i>
              Breed: ${breed ? breed : "No Info"}
            </p>
            <p class="">
              <i class="fa-light fa-calendar fa-lg pr-2"></i> Birth: ${
                date_of_birth ? date_of_birth : "No Info"
              }
            </p>
            <p class="">
              <i class="fa-regular fa-mercury fa-lg pr-2"></i> Gender:
              ${gender ? gender : "No Info"}
            </p>
            <p class="">
              <i class="fa-regular fa-tag fa-lg pr-2"></i> Price : ${price}$
            </p>
            <p class="">
                <i class="fa-regular fa-mercury fa-lg pr-2"></i> Vaccinated Status:
                ${vaccinated_status}
              </p>
          </div>
        </div>
        <div
          class="text-left pt-4 border-t-2 space-y-2"
        >
        <p class="font-semibold">Details Information</p>
        <p class="font-normal text-[#131313B3] text-xs lg:text-base">${pet_details}</p>
        </div>
      </div>
    <div class="modal-action w-full justify-center">
      <form method="dialog" class="w-full px-4">
        <!-- if there is a button in form, it will close the modal -->
            <button class="btn bg-[#0E7A8133] w-full">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
    `;
  my_modal_1.showModal();
};

// Adopt function
function adopted(button) {
  const modal = document.createElement('dialog');
  modal.classList.add('modal');
  
  // the modal content with countdown placeholder
  modal.innerHTML = `
    <div class="modal-box text-center">
      <h3 class="text-xl font-bold pb-5">Congratulations!</h3>
      <span class="text-5xl mt-5 pt-5"><i class="fa-duotone fa-solid fa-handshake fa-lg" style="--fa-primary-color: #26a691; --fa-secondary-color: #baa769;"></i></span>
      <p class="py-4 font-bold">Your adoption process has started for this pet.</p>
      <p>Closing in <span class="countdown"><span style="--value:3;"></span></span> seconds.</p>
      <div class="modal-action">
        <form method="dialog">
          <button class=""></button>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.showModal();

  let countdown = 3; // Countdown time in seconds
  const interval = setInterval(() => {
    countdown--;
    modal.querySelector('.countdown span').style.setProperty('--value', countdown); // Update countdown display
    if (countdown <= 0) {
      clearInterval(interval);
      modal.close();
      document.body.removeChild(modal); // Remove modal from DOM
      button.textContent = 'Adopted'; // Change button text
      button.disabled = true; // Disable the button
    }
  }, 1000);
}

document.getElementById("view-more-button").addEventListener("click", () => {
  const adoptSection = document.getElementById("adopt-your-best-friend-section");
  adoptSection.scrollIntoView({ behavior: "smooth" });
});

loadAllPets();
loadCategories();