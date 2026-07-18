const fs = require('fs');
const path = 'd:/yatish/PROJECTS/nutrivae-home/src/pages/journeys.astro';

let content = fs.readFileSync(path, 'utf8');

// Find the end of timeline-container
const timelineContainerIndex = content.indexOf('<div class="timeline-container" id="journey-timeline">');
if (timelineContainerIndex === -1) {
  console.log("Could not find timeline container");
  process.exit(1);
}

// The timeline container closes before the first hardcoded journey-row in the modal
// We want to keep the timeline container and its children.
// Let's just find the first occurrence of: <div class="journey-row" data-category="ready">
// which is exactly where the garbage starts.
const garbageStart = content.indexOf('<div class="journey-row" data-category="ready">', timelineContainerIndex);

if (garbageStart === -1) {
  console.log("Could not find garbage start");
  process.exit(1);
}

// Extract everything up to the garbage start
let newContent = content.substring(0, garbageStart);

// Now append the correct ending.
newContent += `          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div id="lightbox-overlay">
      <img id="lightbox-img" src="" alt="Expanded View" />
    </div>

    <script is:inline>
      (function () {
        console.log("Init filter & pagination for journeys");
        const filterBtns = document.querySelectorAll(".filter-btn");
        const products = document.querySelectorAll(".journey-row");
        const categoryLabel = document.getElementById("currentCategoryLabel");
        const paginationContainer = document.querySelector(".pagination");
        const searchInput = document.getElementById("journeySearch");

        let currentFilter = "all";
        let currentSearch = "";
        let currentPage = 1;
        const itemsPerPage = 12;
        let filteredItems = Array.from(products);

        if (!paginationContainer) {
          console.error("Missing paginationContainer");
          return;
        }

        function renderPagination() {
          const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
          paginationContainer.innerHTML = "";

          if (totalPages <= 1) return;

          for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.className = "page-btn" + (i === currentPage ? " active" : "");
            btn.textContent = i;
            btn.style.margin = "0 5px";
            btn.addEventListener("click", () => {
              currentPage = i;
              updateView();
              const grid = document.querySelector(".journey-list") || document.querySelector(".full-grid");
              if (grid) {
                const offset = grid.getBoundingClientRect().top + window.scrollY - 150;
                window.scrollTo({ top: offset, behavior: "smooth" });
              }
            });
            paginationContainer.appendChild(btn);
          }
        }

        function updateView() {
          products.forEach((p) => {
            p.style.display = "none";
          });

          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;

          filteredItems.slice(start, end).forEach((p) => {
            p.style.display = p.classList.contains("journey-row") ? "flex" : "block";
            p.style.opacity = "1";
            p.style.transform = "none";
            p.style.animation = "none";
            p.offsetHeight;
            p.classList.add('animated');
          });

          renderPagination();
        }

        function applyFilters() {
          filteredItems = Array.from(products).filter((p) => {
            const cat = p.getAttribute("data-category") || "";
            const name = (p.querySelector("h3")?.textContent || "").toLowerCase();
            const meta = (p.querySelector("p")?.textContent || "").toLowerCase();
            
            const matchesCat = currentFilter === "all" || cat.includes(currentFilter);
            const matchesSearch = currentSearch === "" || name.includes(currentSearch) || meta.includes(currentSearch);
            
            return matchesCat && matchesSearch;
          });
          currentPage = 1;
          updateView();
        }

        filterBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            
            if (categoryLabel) {
              categoryLabel.textContent = btn.textContent;
            }
            
            applyFilters();
          });
        });

        if (searchInput) {
          searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value.toLowerCase();
            applyFilters();
          });
        }

        // Run immediately
        applyFilters();
      })();
      
      // Journey Modal Functionality (Restored)
      (function() {
          const journeyModal = document.getElementById('journey-modal');
          const journeyClose = document.getElementById('journey-modal-close');
          
          const jTitle = document.getElementById('journey-title');
          const jFarmer = document.getElementById('journey-farmer');
          const jLocation = document.getElementById('journey-location');
          const jLocationLink = document.getElementById('journey-location-link');
          let timelineSteps = null;
          if(journeyModal) {
              timelineSteps = journeyModal.querySelectorAll('.timeline-step');
          }

          if(journeyModal && journeyClose) {
              // Use event delegation for dynamic buttons
              document.body.addEventListener('click', (e) => {
                  const btn = e.target.closest('.btn-journey');
                  if (!btn) return;
                  
                  const product = btn.getAttribute('data-product');
                  const farmer = btn.getAttribute('data-farmer');
                  const location = btn.getAttribute('data-location');
                  const timesStr = btn.getAttribute('data-times') || '';
                  const imagesStr = btn.getAttribute('data-images') || '';
                  
                  const times = timesStr.split('|');
                  const images = imagesStr.split('|');
                  
                  if (product && jTitle) jTitle.textContent = product + ' Journey';
                  if (farmer && jFarmer) jFarmer.textContent = farmer;
                  if (location && jLocation) {
                      jLocation.textContent = location;
                      if(jLocationLink) jLocationLink.href = 'https://maps.google.com/?q=' + encodeURIComponent(location);
                  }

                  // Update timeline steps dynamically
                  if(timelineSteps) {
                      timelineSteps.forEach((step, index) => {
                          const timeSpan = step.querySelector('.step-time');
                          const gallery = step.querySelector('.step-gallery');
                          
                          // Time is required (if available in array)
                          if (timeSpan) {
                              timeSpan.textContent = times[index] ? times[index].trim() : '';
                          }
                          
                          // Image is optional and can be multiple
                          if (gallery) {
                              gallery.innerHTML = ''; // Clear previous
                              if (images[index] && images[index].trim() !== '') {
                                  const stepImgs = images[index].split(',');
                                  stepImgs.forEach((imgSrc, imgIndex) => {
                                      if (!imgSrc.trim()) return;
                                      const img = document.createElement('img');
                                      let srcStr = imgSrc.trim();
                                      img.src = srcStr.startsWith('/') ? srcStr : '/' + srcStr;
                                      img.alt = \`Gallery Image \${imgIndex + 1}\`;
                                      // Responsive grid style for gallery items
                                      img.style.width = stepImgs.length > 1 ? 'calc(50% - 5px)' : '100%';
                                      img.style.maxHeight = '150px';
                                      img.style.objectFit = 'cover';
                                      img.style.borderRadius = '8px';
                                      img.style.cursor = 'zoom-in';
                                      img.style.transition = 'transform 0.3s';
                                      img.addEventListener('mouseover', () => img.style.transform = 'scale(1.02)');
                                      img.addEventListener('mouseout', () => img.style.transform = 'scale(1)');
                                      
                                      // Open Lightbox
                                      img.addEventListener('click', () => {
                                          const lbImg = document.getElementById('lightbox-img');
                                          const lbOverlay = document.getElementById('lightbox-overlay');
                                          if(lbImg && lbOverlay) {
                                              lbImg.src = img.src;
                                              lbOverlay.classList.add('active');
                                          }
                                      });
                                      gallery.appendChild(img);
                                  });
                              }
                          }
                      });
                  }

                  journeyModal.classList.add('active');
                  document.body.style.overflow = 'hidden'; // Prevent background scrolling
              });

              const lightboxOverlay = document.getElementById('lightbox-overlay');
              if (lightboxOverlay) {
                  lightboxOverlay.addEventListener('click', () => {
                      lightboxOverlay.classList.remove('active');
                  });
              }

              journeyClose.addEventListener('click', () => {
                  journeyModal.classList.remove('active');
                  document.body.style.overflow = '';
              });

              journeyModal.addEventListener('click', (e) => {
                  if (e.target === journeyModal) {
                      journeyModal.classList.remove('active');
                      document.body.style.overflow = '';
                  }
              });
          }
      })();
    </script>
  </main>
</Layout>
`;

fs.writeFileSync(path, newContent);
console.log("Successfully fixed journeys.astro");
