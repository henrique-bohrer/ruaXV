document.addEventListener('DOMContentLoaded', () => {
    // Dados de exemplo (simulando um banco de dados)
    const storeData = [
        {
            id: 1,
            name: "Lojas Renner",
            category: "Vestuário",
            image: "https://via.placeholder.com/300x180?text=Lojas+Renner",
            offer: "PROMOÇÃO: 20% OFF em jaquetas",
            description: "Grande promoção de inverno! Todas as jaquetas com 20% de desconto. Válido até o final do mês."
        },
        {
            id: 2,
            name: "O Boticário",
            category: "Cosméticos",
            image: "https://via.placeholder.com/300x180?text=O+Boticário",
            offer: "EVENTO: Lançamento nova linha Malbec",
            description: "Venha conhecer a nova fragrância Malbec em nossa loja. Teremos amostras grátis e um coquetel especial no dia 30/09 às 18h."
        },
        {
            id: 3,
            name: "Livrarias Curitiba",
            category: "Livraria",
            image: "https://via.placeholder.com/300x180?text=Livrarias+Curitiba",
            offer: "NOVIDADE: Chegou o novo best-seller",
            description: "O livro mais esperado do ano acaba de chegar em nossas prateleiras. Garanta já o seu exemplar!"
        },
        {
            id: 4,
            name: "Magazine Luiza",
            category: "Eletrônicos",
            image: "https://via.placeholder.com/300x180?text=Magazine+Luiza",
            offer: "OFERTA: Smartphone com 15% OFF",
            description: "Somente esta semana, smartphone modelo X com 15% de desconto à vista ou em 10x sem juros."
        },
        {
            id: 5,
            name: "Cacau Show",
            category: "Alimentação",
            image: "https://via.placeholder.com/300x180?text=Cacau+Show",
            offer: "PROMOÇÃO: Leve 3 pague 2 em trufas",
            description: "Aproveite nossa deliciosa promoção de trufas. Na compra de 2, a terceira é por nossa conta!"
        },
        {
            id: 6,
            name: "Ponto Frio",
            category: "Eletrodomésticos",
            image: "https://via.placeholder.com/300x180?text=Ponto+Frio",
            offer: "OFERTA: Air Fryer em promoção",
            description: "Sua cozinha mais moderna com a Air Fryer da marca Y. Preço especial por tempo limitado."
        }
    ];

    const storeGrid = document.getElementById('store-grid');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    // Função para exibir as lojas
    const displayStores = (stores) => {
        storeGrid.innerHTML = '';
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
    };

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };


    // Filtro de busca
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredStores = storeData.filter(store =>
            store.name.toLowerCase().includes(searchTerm) ||
            store.category.toLowerCase().includes(searchTerm) ||
            store.offer.toLowerCase().includes(searchTerm)
        );
        displayStores(filteredStores);
    });

    // Eventos do modal
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Exibição inicial das lojas
    displayStores(storeData);
});