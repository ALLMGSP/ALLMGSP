// Função para mostrar abas
function showTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    window.scrollTo(0, 0);
}

// Menu mobile
const menuToggle = document.querySelector('.header__menu-toggle');
const body = document.body;

menuToggle.addEventListener('click', () => {
    body.classList.toggle('nav-open');
});

function closeMobileMenu() {
    body.classList.remove('nav-open');
}

// Animação de números (Nossos Logros)
document.addEventListener("DOMContentLoaded", function() {
    const achievementsSection = document.querySelector('.achievements');

    const animateNumbers = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const achievementNumbers = document.querySelectorAll('.achievement__number');
                achievementNumbers.forEach(numElement => {
                    const target = +numElement.getAttribute('data-target');
                    numElement.innerText = '0';
                    const duration = 2000; // 2 segundos
                    const stepTime = 10; // ms
                    const totalSteps = duration / stepTime;
                    const increment = target / totalSteps;

                    const updateCount = () => {
                        const c = +numElement.innerText;
                        if (c < target) {
                            numElement.innerText = `${Math.ceil(c + increment)}`;
                            setTimeout(updateCount, stepTime);
                        } else {
                            numElement.innerText = target;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(achievementsSection);
            }
        });
    };

    const observer = new IntersectionObserver(animateNumbers, {
        threshold: 0.1
    });

    if (achievementsSection) {
        observer.observe(achievementsSection);
    }
});


// Carousel da Home
let currentIndex = 0;
const carouselImages = document.querySelector('.carousel-images');
if (carouselImages) {
    const totalImages = document.querySelectorAll('.carousel-images img').length;
    const indicators = document.querySelectorAll('.indicator');

    function updateCarousel() {
        if (!document.querySelector('.carousel')) return;
        const width = document.querySelector('.carousel').clientWidth;
        carouselImages.style.transform = `translateX(${-currentIndex * width}px)`;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function moveCarousel(n) {
        currentIndex = (currentIndex + n + totalImages) % totalImages;
        updateCarousel();
    }

    function goToSlide(n) {
        currentIndex = n;
        updateCarousel();
    }
    
    // Auto-avanço do carousel
    setInterval(() => {
        moveCarousel(1);
    }, 5000); // Muda a cada 5 segundos
}


// Accordion (FAQ e Expertise)
function toggleAccordion(element) {
    const content = element.nextElementSibling;
    element.classList.toggle('active');

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.paddingTop = null;
        content.style.paddingBottom = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.paddingTop = '15px';
        content.style.paddingBottom = '15px';
    }
}

// Image Viewer (modal de imagem)
const imageViewer = document.getElementById('image-viewer');
const viewerImg = document.getElementById('viewer-img');
const viewerTitle = document.getElementById('viewer-title');
const viewerText = document.getElementById('viewer-text');
const clientItems = document.querySelectorAll('.client-item');

function showImage(src) {
    if(viewerImg) viewerImg.src = src;
    if(imageViewer) imageViewer.style.display = 'flex';
    if(viewerTitle) viewerTitle.style.display = 'none';
    if(viewerText) viewerText.style.display = 'none';
}

clientItems.forEach(item => {
    item.addEventListener('click', () => {
        viewerImg.src = item.querySelector('img').src;
        viewerTitle.textContent = item.dataset.name;
        viewerText.textContent = item.dataset.info;

        viewerTitle.style.display = 'block';
        viewerText.style.display = 'block';
        imageViewer.style.display = 'flex';
    });
});

function closeImage() {
    if(imageViewer) imageViewer.style.display = 'none';
}

// Athlete Viewer (Modal do Atleta)
const athleteViewer = document.getElementById('athlete-viewer');
const athleteCards = document.querySelectorAll('.athlete-card');

const ratingColors = {
    'SS': 'linear-gradient(145deg, #ffdf70, #ffb347)',
    'S': 'linear-gradient(145deg, #e8e8e8, #b0b0b0)',
    'A': 'linear-gradient(145deg, #d88f42, #a0522d)',
    'B': 'linear-gradient(145deg, #5a9fe2, #357abd)',
    'C': 'linear-gradient(145deg, #60e3d2, #20c997)',
    'D': 'linear-gradient(145deg, #c4c4c4, #8d8d8d)'
};

athleteCards.forEach(card => {
    card.addEventListener('click', () => {
        if (!athleteViewer) return;
        const data = card.dataset;
        const stats = JSON.parse(data.stats);
        const physical = JSON.parse(data.physical);

        document.getElementById('athlete-modal-photo').src = data.photo;
        document.getElementById('athlete-modal-name').textContent = data.name;
        document.getElementById('athlete-modal-role').textContent = data.role;
        document.getElementById('athlete-modal-age').innerHTML = `<strong>Idade:</strong> ${data.age}`;
        document.getElementById('athlete-modal-foot').innerHTML = `<strong>Pé Dominante:</strong> ${data.foot}`;
        document.getElementById('athlete-modal-club').innerHTML = `<strong>Clube:</strong> ${data.club}`;
        document.getElementById('athlete-modal-bio').textContent = data.bio;

        const statsContainer = document.getElementById('athlete-modal-stats');
        statsContainer.innerHTML = '';
        for (const [key, value] of Object.entries(stats.stats)) {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item-modal';
            statItem.innerHTML = `<span class="stat-item-modal__name">${key}</span><span class="stat-item-modal__value" style="background: ${ratingColors[value] || '#555'}">${value}</span>`;
            statsContainer.appendChild(statItem);
        }

        const physicalContainer = document.getElementById('athlete-modal-physical');
        physicalContainer.innerHTML = '';
        for (const [key, value] of Object.entries(physical)) {
            const physicalItem = document.createElement('div');
            physicalItem.className = 'physical-stat-item';
            physicalItem.innerHTML = `
                <span class="physical-stat-label">${key}</span>
                <div class="physical-stat-bar-container">
                    <div class="physical-stat-bar" data-value="${value}">${value}</div>
                </div>`;
            physicalContainer.appendChild(physicalItem);
             
            setTimeout(() => {
                const bar = physicalItem.querySelector('.physical-stat-bar');
                bar.style.width = `${bar.dataset.value}%`;
            }, 100);
        }

        const videoWrapper = document.getElementById('athlete-modal-video-wrapper');
        videoWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${data.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

        athleteViewer.style.display = 'flex';
    });
});

function closeAthlete() {
    if (!athleteViewer) return;
    const videoWrapper = document.getElementById('athlete-modal-video-wrapper');
    if (videoWrapper) {
        videoWrapper.innerHTML = ''; // Para o vídeo ao fechar
    }
    athleteViewer.style.display = 'none';
}


// Carousel de Clientes
const clientsCarousel = document.querySelector('.clients__carousel-content');
if (clientsCarousel && clientsCarousel.children.length > 0) {
    const allClientItems = Array.from(clientsCarousel.children);
    
    // Duplicar os itens para o efeito de carrossel infinito se houver itens suficientes
    if (allClientItems.length > 0) {
        allClientItems.forEach(item => {
            const clone = item.cloneNode(true);
            clientsCarousel.appendChild(clone);
        });
    }

    const nextBtn = document.querySelector('.clients-carousel-btn.next');
    const prevBtn = document.querySelector('.clients-carousel-btn.prev');
    let clientCarouselIndex = 0;
    
    if (nextBtn && prevBtn && allClientItems.length > 0) {
        const clientItemWidth = allClientItems[0].offsetWidth + 40; // Largura + margem
        const itemsToScroll = 1; 
        const maxIndex = allClientItems.length;

        nextBtn.addEventListener('click', () => {
            clientCarouselIndex += itemsToScroll;
            if (clientCarouselIndex >= maxIndex) {
                 clientCarouselIndex = 0;
                 clientsCarousel.style.transition = 'none';
                 clientsCarousel.style.transform = `translateX(0px)`;
                 setTimeout(() => {
                    clientsCarousel.style.transition = 'transform 0.5s ease';
                 }, 50);
            }
            clientsCarousel.style.transform = `translateX(-${clientCarouselIndex * clientItemWidth}px)`;
        });

        prevBtn.addEventListener('click', () => {
            clientCarouselIndex -= itemsToScroll;
            if (clientCarouselIndex < 0) {
                clientCarouselIndex = maxIndex -1;
                clientsCarousel.style.transition = 'none';
                clientsCarousel.style.transform = `translateX(-${clientCarouselIndex * clientItemWidth}px)`;
                setTimeout(() => {
                    clientsCarousel.style.transition = 'transform 0.5s ease';
                 }, 50);
            }
            clientsCarousel.style.transform = `translateX(-${clientCarouselIndex * clientItemWidth}px)`;
        });
    }
}


// Ativar aba Home por padrão e outras inicializações
document.addEventListener('DOMContentLoaded', () => {
    showTab('home');

    // Inicializa o carrossel da home se existir
    if (document.querySelector('.carousel-images')) {
       updateCarousel();
    }

    // Colore os segmentos do gráfico de pizza
    document.querySelectorAll('.donut-segment').forEach(segment => {
       const color = segment.dataset.color;
       if (color) {
           segment.style.stroke = color;
       }
    });
});
