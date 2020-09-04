(function ($, document, window) {
    $(document).ready(function () {

        $('.cart').hide();
        $('#btnLogout').hide();

        // Cloning main navigation for mobile menu
        $('.mobile-navigation').append($('.main-navigation .menu').clone());

        // Mobile menu toggle
        $('.toggle-menu').click(function () {
            $('.mobile-navigation').slideToggle();
        });

        $('.home-slider').flexslider({
            controlNav: true,
            directionNav: false
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
                for (let i = 0; i < response.length; i++) {
                    const game = response[i];
                    const elemId = i + 1;

                    $('#slideImage' + elemId).css('background-image', 'url(assets/images/games/slide-' + game.imageName + ')')
                    $('#slideTitle' + elemId).text(game.title);
                    $('#slidePrice' + elemId).text(commafy(game.price) + ' ден.');
                    $('#slideDescription' + elemId).text(game.description);
                    $('#slideAddToCart' + elemId).click(e => addToCart(e, game));
                }
            }).error(e => console.error(e.message));

            // Get first 4 games
            $.get('http://localhost:3000/games?limit=4', response => {
                for (let i = 0; i < response.length; i++) {
                    const game = response[i];
                    const elemId = i + 1;

                    $('#gameLink' + elemId).attr('href', 'game.html?id=' + game.id);
                    $('#gameTitle' + elemId).attr('href', 'game.html?id=' + game.id);
                    $('#gameMoreDetails' + elemId).attr('href', 'game.html?id=' + game.id);
                    $('#gameImage' + elemId).attr('src', 'assets/images/games/' + game.imageName);
                    $('#gameTitle' + elemId).text(game.title);
                    $('#gamePrice' + elemId).text(commafy(game.price) + ' ден.');
                    $('#gameDevice' + elemId).text(game.device);

                    $('#addToCart' + elemId).click(e => addToCart(e, game));
                }
            }).error(e => console.error(e.message));
        }
        if (page.startsWith('game.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (id) {
                // Get game details by ID
                $.get('http://localhost:3000/games/' + id, data => {
                    const game = data[0];
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
                }).error(e => console.error(e.message));
            }
        }
        if (page.startsWith('cart.html')) {
            if (userId && username) {
                getCart(false);
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
                }).error(() => $('#errorMessage').text('Ншто не беше во ред, Ве молиме обидете се повторно!'));
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
                }).error(() => $('#registerErrorMessage').text('Ншто не беше во ред, Ве молиме обидете се повторно!'));
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

            $.post('http://localhost:3000/addToCart/', {userId: 1, gameId: game.id, quantity: 1}, () => {
                getCart(true);
            }).error(e => console.error(e.message));
        }

        function getCart(onlyCount) {
            $.get('http://localhost:3000/getCart/' + userId, response => {
                let html = '';
                $('tbody').text(html);
                $('#itemCount').text(response.length);

                if (!onlyCount) {
                    if (response.length > 0) {
                        // Rendering and filling table with items
                        response.forEach(item => {
                            html += '<tr>' +
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
                                $.post('http://localhost:3000/deleteFromCart/', {
                                    userId,
                                    gameId: item.gameId
                                }, () => {
                                    loading = false;
                                    getCart(false)
                                }).error(e => {
                                    loading = false;
                                    console.error(e)
                                });
                            });
                        })
                    } else {
                        $('tbody').append('<tr id="noItems">' +
                            '<td class="product-name">' +
                            '<div class="product-detail">' +
                            '<p>Во кошничката немате продукти</p>' +
                            '</div></td></tr>');
                    }
                }
            }).error(e => console.error(e.message));
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
