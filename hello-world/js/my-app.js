var app = {
    framework7: null,
    dom: null,
    mainView: null,
    ajax: null,
    initialize: function () {
        var that = this;
        this.initFramework7();
    },
    initFramework7: function () {
        var that = this;

        that.framework7 = new Framework7({
            cache: false,
            template7Pages: true
        });

        that.dom = Dom7;

        that.mainView = that.framework7.addView('.view-main', {
            dynamicNavbar: true
        });

        that.ajax = that.dom.ajax;

        that.framework7.onPageInit('*', that.globalInitPageMiddleware);
        that.framework7.onPageBack('*', that.globalBackPageMiddleware);
        that.addPageEvents();

        that.getUsers();
    },
    globalInitPageMiddleware: function (page) {
        console.log('%c INIT: ' + page.name, 'background: #0D96F2; color: #ffffff; padding: 5px;');
    },
    globalBackPageMiddleware: function (page) {
        console.log('%c BACK: ' + page.name, 'background: #D8F9C3; color: #0D96F2; padding: 5px;');
    },
    getUsers: function () {
        var that = this;

        /*that.ajax({
            url: 'https://api.github.com/users',
            method: 'GET',
            success: function (data) {
                that.displayUsers(JSON.parse(data));
            }
        })*/
        that.displayUsers(USERS);
    },
    displayUsers: function (users) {
        var usersHtml = '';
        $.each(users, function (i, user) {
            usersHtml += '<li>\n' +
                '      <a href="info.html?username=' + user.login + '" class="item-link item-content">\n' +
                '        <div class="item-media"><img src="' + user.avatar_url + '" width="80"></div>\n' +
                '        <div class="item-inner">\n' +
                '          <div class="item-title-row">\n' +
                '            <div class="item-title">' + user.login + '</div>\n' +
                '            <div class="item-after">$15</div>\n' +
                '          </div>\n' +
                '          <div class="item-subtitle">' + user.type + '</div>\n' +
                '        </div>\n' +
                '      </a>\n' +
                '    </li>';
        });

        $('.users-list').append(usersHtml);
    },
    addPageEvents: function () {
        var that = this;

        /*that.framework7.onPageInit(PAGES.info, function (page) {
            that.ajax({
                url: 'https://api.github.com/users/' + page.query.username,
                method: 'GET',
                success: function (data) {
                    that.displayUser(JSON.parse(data));
                }
            });
        });*/
        that.displayUser(USER);
    },
    displayUser: function (user) {
        console.log(user);
    }
};

app.initialize();