document.addEventListener('DOMContentLoaded', () => {

    // Função para alternar entre as abas principais
    window.showTab = function(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        const newTab = document.getElementById(tabId);
        if (newTab) {
            newTab.classList.add('active');
        } else if (tabId === 'home') { // Fallback para o logo
             document.getElementById('home').classList.add('active');
        }
        window.scrollTo(0, 0);
    }
    
    // Inicializa a aba 'home' se nenhuma estiver ativa
    if (!document.querySelector('.tab-content.active')) {
        showTab('home');
    }

    // --- LÓGICA DO MENU MOBILE ---
    const menuToggle = document.querySelector('.header__menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    // Função para fechar o menu ao clicar em um link (usada no HTML)
    window.closeMobileMenu = function() {
        document.body.classList.remove('nav-open');
    }


    // --- Lógica do Carrossel Principal ---
    const carouselSection = document.querySelector('.carousel-section-lateral');
    if (carouselSection) {
        let currentIndex = 0;
        const carouselImagesContainer = carouselSection.querySelector('.carousel-images');
        const images = carouselImagesContainer.querySelectorAll('img');
        const totalImages = images.length;
        let slideWidth = carouselImagesContainer.clientWidth;

        function updateSlideWidth() {
            slideWidth = carouselImagesContainer.clientWidth;
            goToSlide(currentIndex);
        }

        window.moveCarousel = function(direction) {
            currentIndex += direction;
            if (currentIndex < 0) {
                currentIndex = totalImages - 1;
            } else if (currentIndex >= totalImages) {
                currentIndex = 0;
            }
            goToSlide(currentIndex);
        }

        window.goToSlide = function(index) {
            currentIndex = index;
            const offset = -currentIndex * slideWidth;
            carouselImagesContainer.style.transform = `translateX(${offset}px)`;
            updateIndicators();
        }

        function updateIndicators() {
            carouselSection.querySelectorAll('.carousel-indicators .indicator').forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });
        }
        window.addEventListener('resize', updateSlideWidth);
        goToSlide(0);
    }

    // --- Lógica do Carrossel de Parceiros ---
    const partnerCarousel = document.querySelector('.clients__carousel-content');
    if (partnerCarousel) {
        const prevBtn = document.querySelector('.clients-carousel-btn.prev');
        const nextBtn = document.querySelector('.clients-carousel-btn.next');
        const partnerItems = partnerCarousel.querySelectorAll('.client-item');
        if (partnerItems.length > 0) {
            const itemWidth = partnerItems[0].offsetWidth + 40;
            let currentPartnerIndex = 0;

            function updatePartnerCarouselPosition() {
                partnerCarousel.style.transform = `translateX(${-currentPartnerIndex * itemWidth}px)`;
            }

            nextBtn.addEventListener('click', () => {
                const itemsInView = Math.floor(partnerCarousel.parentElement.offsetWidth / itemWidth);
                const maxIndex = partnerItems.length - itemsInView;
                if (currentPartnerIndex < maxIndex) {
                    currentPartnerIndex++;
                    updatePartnerCarouselPosition();
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentPartnerIndex > 0) {
                    currentPartnerIndex--;
                    updatePartnerCarouselPosition();
                }
            });
            
            partnerItems.forEach(item => {
                item.addEventListener('click', () => {
                    const name = item.dataset.name;
                    const info = item.dataset.info;
                    const imgSrc = item.querySelector('img').src;
                    showPartnerInfo(name, info, imgSrc);
                });
            });
        }
    }

    // --- Lógica dos Modais (Visualizadores de Imagem e Atleta) ---
    const imageViewer = document.getElementById('image-viewer');
    const athleteViewer = document.getElementById('athlete-viewer');

    function showPartnerInfo(name, info, imgSrc) {
        const viewerTitle = document.getElementById('viewer-title');
        const viewerImg = document.getElementById('viewer-img');
        const viewerText = document.getElementById('viewer-text');

        viewerTitle.style.display = 'block';
        viewerImg.style.display = 'block';
        viewerText.style.display = 'block';

        viewerTitle.textContent = name;
        viewerImg.src = imgSrc;
        viewerText.textContent = info;
        
        if (imageViewer) imageViewer.style.display = 'flex';
    }

    window.showImage = function(src) {
        const viewerTitle = document.getElementById('viewer-title');
        const viewerImg = document.getElementById('viewer-img');
        const viewerText = document.getElementById('viewer-text');

        viewerTitle.style.display = 'none';
        viewerImg.style.display = 'block';
        viewerText.style.display = 'none';

        viewerImg.src = src;

        if (imageViewer) imageViewer.style.display = 'flex';
    }
    
    window.closeImage = function() {
        if (imageViewer) {
            imageViewer.style.display = 'none';
            document.getElementById('viewer-title').textContent = '';
            document.getElementById('viewer-img').src = '';
            document.getElementById('viewer-text').textContent = '';
        }
    }

    if (imageViewer) {
        imageViewer.addEventListener('click', (event) => {
            if (event.target === imageViewer) closeImage();
        });
    }
    
    function showAthleteModal(data) {
        document.getElementById('athlete-modal-photo').src = data.photo;
        document.getElementById('athlete-modal-name').innerText = data.name;
        document.getElementById('athlete-modal-role').innerText = data.role;
        document.getElementById('athlete-modal-age').innerHTML = `<strong>Idade:</strong> ${data.age}`;
        document.getElementById('athlete-modal-foot').innerHTML = `<strong>Pé Dominante:</strong> ${data.foot}`;
        document.getElementById('athlete-modal-club').innerHTML = `<strong>Clube Atual:</strong> ${data.club}`;
        document.getElementById('athlete-modal-bio').innerText = data.bio;
        
        const videoWrapper = document.getElementById('athlete-modal-video-wrapper');
        videoWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${data.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        
        const statsContainer = document.getElementById('athlete-modal-stats');
        statsContainer.innerHTML = '';

        if (data.stats) {
            try {
                const stats = JSON.parse(data.stats);
                if (stats.stats) {
                    for (const [statName, statValue] of Object.entries(stats.stats)) {
                        const statEl = document.createElement('div');
                        statEl.className = 'stat-item-modal';

                        const nameEl = document.createElement('span');
                        nameEl.className = 'stat-item-modal__name';
                        nameEl.textContent = statName;

                        const valueEl = document.createElement('span');
                        valueEl.className = `stat-item-modal__value rating-${statValue.toLowerCase()}`;
                        valueEl.textContent = statValue;

                        statEl.appendChild(nameEl);
                        statEl.appendChild(valueEl);
                        statsContainer.appendChild(statEl);
                    }
                }
            } catch (e) {
                console.error("Erro ao analisar o JSON de estatísticas do atleta:", e);
                statsContainer.innerHTML = '<p>Estatísticas indisponíveis.</p>';
            }
        }
        
        const physicalContainer = document.getElementById('athlete-modal-physical');
        physicalContainer.innerHTML = '';

        if (data.physical) {
            try {
                const physicalStats = JSON.parse(data.physical);
                for (const [statName, statValue] of Object.entries(physicalStats)) {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'physical-stat-item';
                    const labelEl = document.createElement('div');
                    labelEl.className = 'physical-stat-label';
                    labelEl.textContent = statName;
                    const barContainerEl = document.createElement('div');
                    barContainerEl.className = 'physical-stat-bar-container';
                    const barEl = document.createElement('div');
                    barEl.className = 'physical-stat-bar';
                    setTimeout(() => {
                        barEl.style.width = `${statValue}%`;
                    }, 50);
                    barEl.textContent = statValue;
                    barContainerEl.appendChild(barEl);
                    itemEl.appendChild(labelEl);
                    itemEl.appendChild(barContainerEl);
                    physicalContainer.appendChild(itemEl);
                }
            } catch (e) {
                console.error("Erro ao analisar o JSON de atributos físicos:", e);
                physicalContainer.innerHTML = '<p>Atributos físicos indisponíveis.</p>';
            }
        }

        if(athleteViewer) athleteViewer.style.display = 'flex';
    }

    window.closeAthlete = function() {
        const videoWrapper = document.getElementById('athlete-modal-video-wrapper');
        if (videoWrapper) videoWrapper.innerHTML = ''; 
        if (athleteViewer) athleteViewer.style.display = 'none';
    }

    if (athleteViewer) {
        athleteViewer.addEventListener('click', (event) => {
            if (event.target === athleteViewer) closeAthlete();
        });
    }

    document.querySelectorAll('.athlete-card').forEach(card => {
        card.addEventListener('click', () => {
            const athleteData = {
                photo: card.dataset.photo,
                name: card.dataset.name,
                role: card.dataset.role,
                age: card.dataset.age,
                foot: card.dataset.foot,
                club: card.dataset.club,
                bio: card.dataset.bio,
                videoId: card.dataset.videoId,
                stats: card.dataset.stats,
                physical: card.dataset.physical
            };
            showAthleteModal(athleteData);
        });
    });

    // --- Lógica do Acordeão (FAQ/Expertise) ---
    window.toggleAccordion = function(button) {
        const content = button.nextElementSibling;
        button.classList.toggle('active');

        if (content.style.maxHeight && content.style.maxHeight !== "0px") {
            content.style.maxHeight = "0px";
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }
    
    document.querySelectorAll('.accordion-content').forEach(content => {
        content.style.maxHeight = "0px";
    });

    // --- LÓGICA: CONTADOR DE LOGROS/ACHIEVEMENTS ---
    const achievementsSection = document.querySelector('.achievements');
    let hasAnimated = false;

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                const counters = document.querySelectorAll('.achievement__number');
                counters.forEach(counter => {
                    counter.innerText = '0';
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    let start = 0;
                    const increment = target / (duration / 16); 

                    const updateCounter = () => {
                        start += increment;
                        if (start < target) {
                            counter.innerText = Math.ceil(start).toLocaleString('pt-BR');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString('pt-BR');
                        }
                    };
                    updateCounter();
                });
                hasAnimated = true; 
                observer.unobserve(achievementsSection);
            }
        });
    };
    
    const observer = new IntersectionObserver(animateCounters, {
        threshold: 0.5
    });

    if (achievementsSection) {
        observer.observe(achievementsSection);
    }
});
