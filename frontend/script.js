document.addEventListener('DOMContentLoaded', () => {
    // Dados de exemplo (simulando um banco de dados)
    const storeData = [
        {
            id: 1,
            name: "Lojas Renner",
            category: "Vestuário",
            image: "https://via.placeholder.com/300x180?text=Lojas+Renner",
            offer: "PROMOÇÃO: 20% OFF em jaquetas",
            description: "Grande promoção de inverno! Todas as jaquetas com 20% de desconto. Válido até o final do mês.",
            lat: -25.4284,
            lon: -49.2733
        },
        {
            id: 2,
            name: "O Boticário",
            category: "Cosméticos",
            image: "https://via.placeholder.com/300x180?text=O+Boticário",
            offer: "EVENTO: Lançamento nova linha Malbec",
            description: "Venha conhecer a nova fragrância Malbec em nossa loja. Teremos amostras grátis e um coquetel especial no dia 30/09 às 18h.",
            lat: -25.4290,
            lon: -49.2740
        },
        {
            id: 3,
            name: "Livrarias Curitiba",
            category: "Livraria",
            image: "https://via.placeholder.com/300x180?text=Livrarias+Curitiba",
            offer: "NOVIDADE: Chegou o novo best-seller",
            description: "O livro mais esperado do ano acaba de chegar em nossas prateleiras. Garanta já o seu exemplar!",
            lat: -25.4280,
            lon: -49.2720
        },
        {
            id: 4,
            name: "Magazine Luiza",
            category: "Eletrônicos",
            image: "https://via.placeholder.com/300x180?text=Magazine+Luiza",
            offer: "OFERTA: Smartphone com 15% OFF",
            description: "Somente esta semana, smartphone modelo X com 15% de desconto à vista ou em 10x sem juros.",
            lat: -25.4295,
            lon: -49.2748
        },
        {
            id: 5,
            name: "Cacau Show",
            category: "Alimentação",
            image: "https://via.placeholder.com/300x180?text=Cacau+Show",
            offer: "PROMOÇÃO: Leve 3 pague 2 em trufas",
            description: "Aproveite nossa deliciosa promoção de trufas. Na compra de 2, a terceira é por nossa conta!",
            lat: -25.4288,
            lon: -49.2738
        },
        {
            id: 6,
            name: "Ponto Frio",
            category: "Eletrodomésticos",
            image: "https://via.placeholder.com/300x180?text=Ponto+Frio",
            offer: "OFERTA: Air Fryer em promoção",
            description: "Sua cozinha mais moderna com a Air Fryer da marca Y. Preço especial por tempo limitado.",
            lat: -25.4278,
            lon: -49.2715
        }
    ];

    const storeGrid = document.getElementById('store-grid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const offerFilter = document.getElementById('offerFilter');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    // Função para exibir as lojas e atualizar o mapa
    const displayStores = (stores) => {
        storeGrid.innerHTML = '';
        stores.forEach(store => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${store.image}" alt="${store.name}">
                <div class="card-content">
                    <h3>${store.name}</h3>
                    <p class="category">${store.category}</p>
                    <span class="tag">${store.offer.split(':')[0]}</span>
                    <p class="offer-text">${store.offer.split(':').slice(1).join(':').trim()}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(store));
            storeGrid.appendChild(card);
        });
        updateMapMarkers(stores); // Atualiza o mapa com as lojas filtradas
    };

    // Função para abrir o modal com detalhes
    const openModal = (store) => {
        modalBody.innerHTML = `
            <h2>${store.name}</h2>
            <p><strong>Categoria:</strong> ${store.category}</p>
            <h3>${store.offer}</h3>
            <p>${store.description}</p>
            <img src="${store.image}" alt="${store.name}" style="width:100%; border-radius: 8px; margin-top: 15px;">
        `;
        modal.style.display = 'block';
    };

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };


    // --- Funções de Filtro ---

    // Popula os filtros de categoria e tipo de oferta
    const populateFilters = () => {
        const categories = [...new Set(storeData.map(store => store.category))];
        const offerTypes = [...new Set(storeData.map(store => store.offer.split(':')[0]))];

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        offerTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            offerFilter.appendChild(option);
        });
    };

    // Aplica todos os filtros em conjunto
    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedOffer = offerFilter.value;

        const filteredStores = storeData.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchTerm) ||
                                  store.category.toLowerCase().includes(searchTerm) ||
                                  store.offer.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory ? store.category === selectedCategory : true;
            const matchesOffer = selectedOffer ? store.offer.startsWith(selectedOffer) : true;

            return matchesSearch && matchesCategory && matchesOffer;
        });

        displayStores(filteredStores);
    };

    // --- Eventos ---

    // Adiciona listeners aos filtros
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    offerFilter.addEventListener('change', applyFilters);

    // Eventos do modal
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    let map;
    let markerLayer;

    // --- Funções do Mapa ---
    const initMap = () => {
        map = L.map('map').setView([-25.4284, -49.2733], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        markerLayer = L.layerGroup().addTo(map);
    };

    // Atualiza os marcadores no mapa
    const updateMapMarkers = (stores) => {
        markerLayer.clearLayers();
        stores.forEach(store => {
            const marker = L.marker([store.lat, store.lon]);
            marker.bindPopup(`<b>${store.name}</b><br>${store.offer}`);
            markerLayer.addLayer(marker);
        });
    };

    // --- Inicialização ---
    initMap();
    populateFilters();
    applyFilters(); // Exibe todas as lojas inicialmente
});