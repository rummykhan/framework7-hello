var ENV_DEV = true;

var app = {
  framework7: null,
  dom: null,
  mainView: null,
  ajax: null,
  initialize: function () {
    this.initFramework7();
  },
  initFramework7: function () {

    this.framework7 = new Framework7({
      cache: false,
      template7Pages: true
    });

    this.dom = Dom7;

    this.mainView = this.framework7.addView('.view-main', {
      //dynamicNavbar: true
    });

    this.ajax = this.dom.ajax;

    this.framework7.onPageInit('*', this.globalInitPageMiddleware);
    this.framework7.onPageBack('*', this.globalBackPageMiddleware);

    this.addPageEvents();
    this.getUsers();
  },
  globalInitPageMiddleware: function (page) {
    console.log('%c INIT: ' + page.name, 'background: #0D96F2; color: #ffffff; padding: 5px;');
  },
  globalBackPageMiddleware: function (page) {
    console.log('%c BACK: ' + page.name, 'background: #D8F9C3; color: #0D96F2; padding: 5px;');
  },
  getUsers: function () {
    var that = this;

    if (ENV_DEV) {
      that.displayUsers(USERS);
      return;
    }

    that.ajax({
      url: 'https://api.github.com/users',
      method: 'GET',
      success: function (data) {
        that.displayUsers(JSON.parse(data));
      }
    })
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

    that.framework7.onPageInit(PAGES.index, function (page) {
      that.getUsers();
    });

    that.framework7.onPageInit(PAGES.info, function (page) {
      that.getUser(page.query.username, that);
    });

    that.framework7.onPageInit(PAGES.repos, function (page) {
      that.getRepos(page.query.username, that);
    });

    that.framework7.onPageInit(PAGES.gists, function (page) {
      that.getGists(page.query.username, that);
    });

    that.framework7.onPageInit(PAGES.followers, function (page) {
      that.getFollowers(page.query.username, that);
    });

    that.framework7.onPageInit(PAGES.following, function (page) {
      that.getFollowings(page.query.username, that);
    });
  },
  getUser: function (username, that) {
    if (ENV_DEV) {
      that.displayUser(USER, that);
      return;
    }

    that.ajax({
      url: 'https://api.github.com/users/' + username,
      method: 'GET',
      success: function (data) {
        that.displayUser(JSON.parse(data), that);
      }
    });


  },
  displayUser: function (user, that) {

    var datetime = moment(user.created_at);

    $('.user-image').attr('src', user.avatar_url);
    $('.joined-on').text('Joined on ' + datetime.format('MMM D, Y'));
    $('.username').text(user.name + ' (' + user.login + ')');

    var statsHtml = '';

    statsHtml += '<li>\n' +
      '      <a href="repos.html?username=' + user.login + '" class="item-link item-content">' +
      '        <div class="item-inner">' +
      '            <div class="item-title">Repositories</div>' +
      '            <div class="item-after"><span class="badge">' + user.public_repos + '</span></div>' +
      '          </div>' +
      '      </a>' +
      '    </li>';

    statsHtml += '<li>\n' +
      '      <a href="gists.html?username=' + user.login + '" class="item-link item-content">' +
      '        <div class="item-inner">' +
      '            <div class="item-title">Gists</div>' +
      '            <div class="item-after"><span class="badge">' + user.public_gists + '</span></div>' +
      '          </div>' +
      '      </a>' +
      '    </li>';

    statsHtml += '<li>\n' +
      '      <a href="followers.html?username=' + user.login + '" class="item-link item-content">' +
      '        <div class="item-inner">' +
      '            <div class="item-title">Followers</div>' +
      '            <div class="item-after"><span class="badge">' + user.followers + '</span></div>' +
      '          </div>' +
      '      </a>' +
      '    </li>';

    statsHtml += '<li>\n' +
      '      <a href="following.html?username=' + user.login + '" class="item-link item-content">' +
      '        <div class="item-inner">' +
      '            <div class="item-title">Following</div>' +
      '            <div class="item-after"><span class="badge">' + user.following + '</span></div>' +
      '          </div>' +
      '      </a>' +
      '    </li>';

    $('.stats-list').append(statsHtml);

    if (!!user.location) {
      $('.location-text').text(user.location);
      $('.location').removeClass('hidden');
    }

    if (!!user.blog) {
      $('.blog-link').text(user.blog);
      $('.blog').removeClass('hidden');
    }

    if (!!user.bio) {
      $('.bio-text').text(user.bio);
      $('.bio').removeClass('hidden');
    }
  },
  getRepos: function (username, that) {

    if (ENV_DEV) {
      that.displayRepos(repos, that);
      return;
    }

    that.ajax({
      url: 'https://api.github.com/users/' + username + '/repos',
      method: 'GET',
      success: function (data) {
        that.displayRepos(JSON.parse(data), that);
      }
    })
  },
  displayRepos: function (repos, that) {
    var reposHtml = '';
    $.each(repos, function (i, repo) {
      var description = !!repo.description ? repo.description : '';
      reposHtml += '<li>\n' +
        '      <a href="repo.html?username=' + repo.owner.login + '&repo=' + repo.name + '" class="item-link item-content">' +
        '        <div class="item-inner">' +
        '          <div class="item-title-row">' +
        '            <div class="item-title">' + repo.name + '<br>' + s(description).substring(0, 40).value() + '...' + '<br>' + repo.html_url + '</div>' +
        '          </div>' +
        '        </div>' +
        '      </a>' +
        '    </li>';
    });

    $('.repos-list').append(reposHtml);
  },
  getGists: function (username, that) {

    if (ENV_DEV) {
      that.displayGists(gists, that);
      return;
    }

    that.ajax({
      url: 'https://api.github.com/users/' + username + '/gists',
      method: 'GET',
      success: function (data) {
        that.displayGists(JSON.parse(data), that);
      }
    })

  },
  displayGists: function (gists, that) {
    var gistsHtml = '';
    $.each(gists, function (i, gist) {
      var description = !!gist.description ? gist.description : '';
      gistsHtml += '<li>\n' +
        '      <a href="gist.html?username=' + gist.owner.login + '&gist=' + gist.name + '" class="item-link item-content">' +
        '        <div class="item-inner">' +
        '          <div class="item-title-row">' +
        '            <div class="item-title">' + s(description).substring(0, 40).value() + '...' + '<br>' + gist.html_url + '</div>' +
        '          </div>' +
        '        </div>' +
        '      </a>' +
        '    </li>';
    });

    $('.gists-list').append(gistsHtml);
  },
  getFollowers: function (username, that) {
    if (ENV_DEV) {
      that.displayFollowers(followers, that);
      return;
    }

    that.ajax({
      url: 'https://api.github.com/users/' + username + '/followers',
      method: 'GET',
      success: function (data) {
        that.displayFollowers(JSON.parse(data), that);
      }
    });
  },
  displayFollowers: function (followers, that) {
    var followersHtml = '';
    $.each(followers, function (i, follower) {
      followersHtml += '<li>\n' +
        '      <a href="info.html?username=' + follower.login + '" class="item-link item-content">\n' +
        '        <div class="item-media"><img src="' + follower.avatar_url + '" width="80"></div>\n' +
        '        <div class="item-inner">\n' +
        '          <div class="item-title-row">\n' +
        '            <div class="item-title">' + follower.login + '</div>\n' +
        '          </div>\n' +
        '          <div class="item-subtitle">' + follower.type + '</div>\n' +
        '        </div>\n' +
        '      </a>\n' +
        '    </li>';
    });

    $('.followers-list').append(followersHtml);
  },
  getFollowings: function (username, that) {
    if (ENV_DEV) {
      that.displayFollowings(following, that);
      return;
    }

    that.ajax({
      url: 'https://api.github.com/users/' + username + '/following',
      method: 'GET',
      success: function (data) {
        that.displayFollowings(JSON.parse(data), that);
      }
    });
  },
  displayFollowings: function (following, that) {
    var followingHtml = '';
    $.each(following, function (i, following) {
      followingHtml += '<li>\n' +
        '      <a href="info.html?username=' + following.login + '" class="item-link item-content">\n' +
        '        <div class="item-media"><img src="' + following.avatar_url + '" width="80"></div>\n' +
        '        <div class="item-inner">\n' +
        '          <div class="item-title-row">\n' +
        '            <div class="item-title">' + following.login + '</div>\n' +
        '          </div>\n' +
        '          <div class="item-subtitle">' + following.type + '</div>\n' +
        '        </div>\n' +
        '      </a>\n' +
        '    </li>';
    });

    $('.following-list').append(followingHtml);
  }
};

app.initialize();