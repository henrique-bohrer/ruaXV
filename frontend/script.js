document.addEventListener('DOMContentLoaded', () => {
    // Dados de exemplo (simulando um banco de dados)
    const storeData = [
        {
            id: 1,
            name: "Lojas Renner",
            category: "Vestuário",
            image: "https://placehold.co/300x180?text=Lojas+Renner",
            offer: "PROMOÇÃO: 20% OFF em jaquetas",
            description: "Grande promoção de inverno! Todas as jaquetas com 20% de desconto. Válido até o final do mês.",
            lat: -25.4284,
            lon: -49.2732
        },
        {
            id: 2,
            name: "O Boticário",
            category: "Cosméticos",
            image: "https://placehold.co/300x180?text=O+Boticário",
            offer: "EVENTO: Lançamento nova linha Malbec",
            description: "Venha conhecer a nova fragrância Malbec em nossa loja. Teremos amostras grátis e um coquetel especial no dia 30/09 às 18h.",
            lat: -25.4295,
            lon: -49.2746
        },
        {
            id: 3,
            name: "Livrarias Curitiba",
            category: "Livraria",
            image: "https://placehold.co/300x180?text=Livrarias+Curitiba",
            offer: "NOVIDADE: Chegou o novo best-seller",
            description: "O livro mais esperado do ano acaba de chegar em nossas prateleiras. Garanta já o seu exemplar!",
            lat: -25.4288,
            lon: -49.2721
        },
        {
            id: 4,
            name: "Magazine Luiza",
            category: "Eletrônicos",
            image: "https://placehold.co/300x180?text=Magazine+Luiza",
            offer: "OFERTA: Smartphone com 15% OFF",
            description: "Somente esta semana, smartphone modelo X com 15% de desconto à vista ou em 10x sem juros.",
            lat: -25.4279,
            lon: -49.2715
        },
        {
            id: 5,
            name: "Cacau Show",
            category: "Alimentação",
            image: "https://placehold.co/300x180?text=Cacau+Show",
            offer: "PROMOÇÃO: Leve 3 pague 2 em trufas",
            description: "Aproveite nossa deliciosa promoção de trufas. Na compra de 2, a terceira é por nossa conta!",
            lat: -25.4301,
            lon: -49.2755
        },
        {
            id: 6,
            name: "Ponto Frio",
            category: "Eletrodomésticos",
            image: "https://placehold.co/300x180?text=Ponto+Frio",
            offer: "OFERTA: Air Fryer em promoção",
            description: "Sua cozinha mais moderna com a Air Fryer da marca Y. Preço especial por tempo limitado.",
            lat: -25.4292,
            lon: -49.2708
        }
    ];

    const storeGrid = document.getElementById('store-grid');
    const searchInput = document.getElementById('searchInput');
    const filterContainer = document.getElementById('filter-container');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const map = L.map('map').setView([-25.4284, -49.2732], 16);
    let markers = L.layerGroup().addTo(map);
    let currentCategory = 'All';

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Função para exibir as lojas
    const displayStores = (stores) => {
        storeGrid.innerHTML = '';
        markers.clearLayers();
        stores.forEach(store => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${store.image}" alt="${store.name}">
                <div class="card-content">
                    <h3>${store.name}</h3>
                    <p>${store.category}</p>
                    <span class="tag">${store.offer.split(':')[0]}</span>
                    <p>${store.offer.split(':')[1]}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(store));
            storeGrid.appendChild(card);

            const marker = L.marker([store.lat, store.lon]).addTo(markers)
                .bindPopup(`<b>${store.name}</b><br>${store.offer}`);
        });
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
        map.setView([store.lat, store.lon], 18);
        markers.eachLayer(marker => {
            if (marker.getLatLng().lat === store.lat && marker.getLatLng().lng === store.lon) {
                marker.openPopup();
            }
        });
    };

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };


    // Função para popular os botões de filtro
    const populateFilterButtons = () => {
        const categories = ['All', ...new Set(storeData.map(store => store.category))];
        filterContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.innerText = category;
            button.className = 'filter-btn';
            if (category === currentCategory) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentCategory = category;
                applyFilters();
                // Update active button style
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            filterContainer.appendChild(button);
        });
    };

    // Função para aplicar filtros (busca e categoria)
    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredStores = storeData;

        // Filtrar por categoria
        if (currentCategory !== 'All') {
            filteredStores = filteredStores.filter(store => store.category === currentCategory);
        }

        // Filtrar por termo de busca
        if (searchTerm) {
            filteredStores = filteredStores.filter(store =>
                store.name.toLowerCase().includes(searchTerm) ||
                store.description.toLowerCase().includes(searchTerm) ||
                store.offer.toLowerCase().includes(searchTerm)
            );
        }

        displayStores(filteredStores);
    };

    // Eventos
    searchInput.addEventListener('input', applyFilters);
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Inicialização
    populateFilterButtons();
    applyFilters();
});