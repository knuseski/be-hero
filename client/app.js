(function ($, document, window) {
    $(document).ready(function () {
        $('.cart').hide();
        $('#btnLogout').hide();
        $('.product-list').text('');

        // Cloning main navigation for mobile menu
        $('.mobile-navigation').append($('.main-navigation .menu').clone());

        // Mobile menu toggle
        $('.toggle-menu').click(function () {
            $('.mobile-navigation').slideToggle();
        });

        $('.login-button').on('click', function () {
            const userId = sessionStorage.getItem('USER_ID');
            const userName = sessionStorage.getItem('USER_NAME');

            if (!userId && !userName) {
                $('.overlay').fadeIn();
                $('.auth-popup').toggleClass('active');
            }
        });

        $('.close, .overlay').on('click', function () {
            $('.overlay').fadeOut();
            $('.popup').toggleClass('active');
        });

        initLightbox({
            selector: '.product-images a',
            overlay: true,
            closeButton: true,
            arrow: true
        });

    });

    let products = [];

    $(window).load(function () {
        const parts = window.location.href.split('\/');
        const page = parts[parts.length - 1];

        const userId = sessionStorage.getItem('USER_ID');
        const username = sessionStorage.getItem('USER_NAME');

        if (userId && username) {
            $('.login-button').text(username);
            $('.cart').show();
            $('#btnLogout').show();
        }

        if (page.startsWith('index.html')) {
            if (userId && username) {
                getCart(true);
            }

            // Get 3 sliding games
            $.get('http://localhost:3000/games/?slide=true&limit=3', response => {
                let html = '';
                $('#slide').text(html);

                response.result.forEach(game => {
                    html +=
                        '<li id="slideImage' + game.id + '">' +
                        '<div class="container">' +
                        '<div class="slide-content">' +
                        '<h2 class="slide-title">' + game.title + '</h2>' +
                        '<small class="slide-subtitle">' + commafy(game.price) + ' ден.</small>' +
                        '<p>' + game.description + '</h2></p>' +
                        '<a id="item' + game.id + '" href="#" class="button">Додади во кошничка</a>' +
                        '</div>' +
                        '</div>' +
                        '</li>'
                });
                $('#slide').append(html);
                $('.home-slider').flexslider({
                    controlNav: true,
                    directionNav: false
                });

                // Adding click event
                let loading = false;
                response.result.forEach(game => {
                    $('#slideImage' + game.id).css('background-image', 'url(assets/images/games/slide-' + game.imageName + ')');
                    $('#item' + game.id).click(e => {
                        loading = true;
                        e.preventDefault();
                        addToCart(e, game);
                    });
                });
            }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));

            // Get first 4 games
            $.get('http://localhost:3000/games?limit=4', response => {
                let html = '';
                $('.product-list').text(html);

                response.result.forEach(game => {
                    html +=
                        '<div class="product">' +
                        '<div class="inner-product">' +
                        '<div class="figure-image">' +
                        '<a href="game.html?id=' + game.id + '">' +
                        '<img src="assets/images/games/' + game.imageName + '" alt="Game">' +
                        '</a>' +
                        '</div>' +
                        '<h3 class="product-title">' +
                        '<a href="game.html?id=' + game.id + '">' + game.title + '</a>' +
                        '</h3>' +
                        '<small class="price">' + commafy(game.price) + ' ден.</small>' +
                        '<p>' + game.device + '</p>' +
                        '<a id="item' + game.id + '" href="#" class="button">Додади во кошничка</a>' +
                        '<a href="game.html?id=' + game.id + '" class="button muted">Повеќе детали</a>' +
                        '</div>' +
                        '</div>'
                });
                $('.product-list').append(html);

                // Adding click event
                let loading = false;
                response.result.forEach(game => {
                    $('#item' + game.id).click(e => {
                        loading = true;
                        e.preventDefault();
                        addToCart(e, game);
                    });
                });
            }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
        }
        if (page.startsWith('pc.html') || page.startsWith('ps.html') || page.startsWith('xbox.html')) {
            let limit = 4;
            let offset = 0;
            let currentPage = 1;

            const device = page.startsWith('pc.html') ? 'Компјутер' : page.startsWith('ps.html') ? 'Play Station' : 'Xbox';

            getGamesByConsole(device, limit, offset, currentPage);
            $('#pageLeft').click(e => {
                e.preventDefault();

                offset -= limit;
                currentPage--;
                getGamesByConsole(limit, offset, currentPage);
            });
            $('#pageRight').click(e => {
                e.preventDefault();

                offset += limit;
                currentPage++;
                getGamesByConsole(limit, offset, currentPage);
            });
        }
        if (page.startsWith('game.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (id) {
                // Get game details by ID
                $.get('http://localhost:3000/games/' + id, data => {
                    const game = data[0];
                    $('#gameNameNav').text(game.title);
                    $('#gameDeviceNav').text('Игри за ' + game.device);
                    const device = game.device === 'Компјутер' ? 'pc.html' : game.device === 'Play Station' ? 'ps.html' : 'xbox.html';
                    $('#gameDeviceNav').attr('href', device);

                    $('#title').text(game.title);
                    $('#price').text(commafy(game.price) + ' ден.');
                    $('#description').text(game.description);
                    $('#image').attr('src', 'assets/images/games/' + game.imageName);

                    if (game.device === 'Компјутер') {
                        $('#device').show();
                        $('#cpu').text(game.cpu);
                        $('#ram').text(game.ram);
                        $('#gpu').text(game.gpu);
                        $('#hdd').text(game.hdd);
                    } else {
                        $('#device').hide();
                    }
                }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
            }
        }
        if (page.startsWith('cart.html')) {
            if (userId && username) {
                getCart(false);

                $('#btnPay').click(e => {
                    e.preventDefault();
                    if (products.length > 0) {
                        $.post('http://localhost:3000/clearCart/', {userId}, () => {
                            getCart(false);
                            swal('Вашата нарачка е примена.' +
                                '\nПратката ќе пристигне во вашиот дом за 5 работни дена' +
                                '\n\nСо почит BeHero');
                        }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
                    }
                });
            } else {
                window.location.href = "index.html";
            }
        }

        $('#bntLogin').click(e => {
            e.preventDefault();
            $('#errorMessage').text('');

            const username = $('#username').val();
            const password = $('#password').val();

            if (username && password) {
                $.post('http://localhost:3000/login', {username, password}, data => {
                    if (data && data.length > 0) {
                        const {id, username} = data[0];
                        sessionStorage.setItem('USER_ID', id);
                        sessionStorage.setItem('USER_NAME', username);
                        $('.login-button').text(username);

                        $('.cart').show();
                        $('#btnLogout').show();

                        $('.overlay').fadeOut();
                        $('.popup').toggleClass('active');
                    } else {
                        $('#password').val('');
                        $('#errorMessage').text('Погрешно корисничко име или лозинка!');
                    }
                }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
            } else {
                $('#errorMessage').text('Сите полиња се задолжителни!');
            }
        });

        $('#btnRegister').click(e => {
            e.preventDefault();
            $('#registerErrorMessage').text('');

            const username = $('#usernameRegister').val();
            const password = $('#passwordRegister').val();

            if (username && password) {
                $.post('http://localhost:3000/register', {username, password}, () => {
                    $('.overlay').fadeOut();
                    $('.popup').toggleClass('active');

                    swal("Hello world!");
                }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
            } else {
                $('#registerErrorMessage').text('Сите полиња се задолжителни!');
            }
        });

        $('#btnLogout').click(e => {
            e.preventDefault();
            sessionStorage.removeItem('USER_ID');
            sessionStorage.removeItem('USER_NAME');

            $('.cart').hide();
            $('#btnLogout').hide();
            $('.login-button').text('Најава/Регистрација');
        });

        function addToCart(e, game) {
            e.preventDefault();
            const userId = sessionStorage.getItem('USER_ID');
            const username = sessionStorage.getItem('USER_NAME');

            if (userId && username) {
                $.post('http://localhost:3000/addToCart/', {userId: userId, gameId: game.id, quantity: 1}, () => {
                    getCart(true);
                    window.location.href = "cart.html";
                }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
            } else {
                swal('Најавете се, за да можете да додадете продукт во кошничка!');
            }
        }

        function getCart(onlyCount) {
            $.get('http://localhost:3000/getCart/' + userId, response => {
                let html = '';
                products = response;
                $('tbody').text(html);
                $('#itemCount').text(response.length);

                if (!onlyCount) {
                    if (response.length > 0) {
                        $('#btnPay').prop('disabled', false);

                        // Rendering and filling table with items
                        response.forEach(item => {
                            html +=
                                '<tr>' +
                                '<td>' + item.title + '</td>' +
                                '<td>' + commafy(item.price) + ' ден.</td>' +
                                '<td>' + item.quantity + '</td>' +
                                '<td>' + commafy(parseInt(item.price) * parseInt(item.quantity)) + ' ден.</td>' +
                                '<td><a class="fa fa-times removeItem" id="item' + item.id + '" href="#"></a></td>' +
                                '</tr>';
                        })
                        $('tbody').append(html);

                        // Adding remove click event
                        let loading = false;
                        response.forEach(item => {
                            $('#item' + item.id).click(e => {
                                loading = true;
                                e.preventDefault();
                                $.post('http://localhost:3000/deleteFromCart/', {userId, gameId: item.gameId}, () => {
                                    loading = false;
                                    getCart(false)
                                }).error(() => {
                                    loading = false;
                                    swal('Нeшто не беше во ред, Ве молиме обидете се повторно!')
                                });
                            });
                        })
                    } else {
                        $('#btnPay').prop('disabled', true);

                        $('tbody').append(
                            '<tr id="noItems">' +
                            '<td class="product-name">' +
                            '<div class="product-detail">' +
                            '<p>Во кошничката немате продукти</p>' +
                            '</div>' +
                            '</td>' +
                            '</tr>'
                        );
                    }
                }
                calculateTotal();
            }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
        }

        function calculateTotal() {
            let total = 0;
            let totalQuantity = 0;
            products.forEach(game => {
                total += (game.price * game.quantity);
                totalQuantity += game.quantity;
            });
            let shipping = 100 * totalQuantity;
            let fullTotal = total + shipping;

            $('#total').text(commafy(total) + ' ден.');
            $('#shipping').text(commafy(shipping) + ' ден.');
            $('#fullTotal').text(commafy(fullTotal) + ' ден.');
        }

        function getGamesByConsole(device, limit, offset, currentPage) {
            $.get('http://localhost:3000/games?device=' + device + '&limit=' + limit + '&offset=' + offset, response => {
                let html = '';
                $('.product-list').text(html);
                response.result.forEach(game => {
                    html +=
                        '<div class="product">' +
                        '<div class="inner-product">' +
                        '<div class="figure-image">' +
                        '<a href="game.html">' +
                        '<img src="assets/images/games/' + game.imageName + '" alt="Game">' +
                        '</div>' +
                        '<h3 class="product-title"><a href="#">' + game.title + '</a></h3>' +
                        '<p>' + game.category + '</p>' +
                        '<a id="item' + game.id + '" href="#" class="button">Додади во кошничка</a>' +
                        '<a href="game.html?id=' + game.id + '" class="button muted">Повеќе детали</a>' +
                        '</div>' +
                        '</div>'
                });
                $('.product-list').append(html);

                // Adding click event
                let loading = false;
                response.result.forEach(game => {
                    $('#item' + game.id).click(e => {
                        loading = true;
                        e.preventDefault();
                        addToCart(e, game);
                    });
                });

                // Calculating total pages
                const total = response.count[0].total;
                let pages = total / limit;
                const needOneMore = pages % 1 !== 0;
                pages = needOneMore ? pages + 1 : pages;

                // Disable left button on first page
                if (currentPage === 1) {
                    $('#pageLeft').prop('disabled', true);
                    $('#pageLeft').removeClass('current');
                } else {
                    $('#pageLeft').prop('disabled', false);
                    $('#pageLeft').addClass('current');
                }

                // Dissble right button on last page
                if (currentPage === parseInt(pages)) {
                    $('#pageRight').prop('disabled', true);
                    $('#pageRight').removeClass('current');
                } else {
                    $('#pageRight').prop('disabled', false);
                    $('#pageRight').addClass('current');
                }

                $('#currentPage').text(currentPage);
            }).error(() => swal('Нeшто не беше во ред, Ве молиме обидете се повторно!'));
        }

        function commafy(num) {
            const str = parseInt(num).toString().split('.');
            if (str[0].length >= 3) {
                str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1\.');
            }
            return str.join('.');
        }
    });
})(jQuery, document, window);
