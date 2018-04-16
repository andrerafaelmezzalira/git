(function() {
	"use strict";

	searching();

	function searching() {

		const search = document.getElementById('search');

		search.onkeyup = ($event) => {

			if($event.keyCode !== 13)
				return;

			const git = new Git;

			git.getUser(search.value, (user) => {

				const demoUserInfo = document.getElementById('demo-user-info');
				const demoRepoInfo = document.getElementById('demo-repo-info');
				demoRepoInfo.innerHTML = '';
				demoUserInfo.innerHTML = '';

				if(!user) {
					demoUserInfo.innerHTML = 'Ops ... Não foi encontrado usuário ' + search.value;
					return;
				}

				const mdlGrid = document.createElement('div');
				const cell = '<div class="mdl-cell mdl-cell--4-col"><div>';
				const div = '</div></div>';

				mdlGrid.innerHTML = cell + (user.email == null ? 'E-mail não disponível' : user.email) + div;
				mdlGrid.innerHTML += cell + user.followers + ' seguidores' + div;
				mdlGrid.innerHTML += cell + user.following + ' seguindo' + div;
				mdlGrid.className = 'mdl-grid';

				demoUserInfo.innerHTML = '<h3>' + user.name + '</h3>';
				if (user.avatar_url != null) {
					demoUserInfo.innerHTML += '<img width="230" height="230" title="' + user.name + '" src="' + user.avatar_url + '"></br>';
				}

				demoUserInfo.innerHTML += '<b>' + (user.bio == null ? 'Não tem biografia :(' : user.bio) + '</b>'

				demoUserInfo.appendChild(mdlGrid);

				getRepo(git, demoRepoInfo, true);
			});
		};

		function getRepo(git, demoRepoInfo, checkMaisEstrelas) {
			git.getUserRepo(search.value, (repos) => {

				if(!repos || repos.length === 0) {
					demoRepoInfo.innerHTML = 'Ops ... Não foi encontrado repositórios para o usuário ' + search.value;
					return;
				}

				demoRepoInfo.innerHTML = '<h3>Repositórios</h3>';

				demoRepoInfo.innerHTML += '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="maisEstrelas">';
				demoRepoInfo.innerHTML += '<input type="radio" name="estrelas" id="maisEstrelas" class="mdl-radio__button" value="true" >';
				demoRepoInfo.innerHTML += '<span class="mdl-radio__label">Mais Estrelas</span>';
				demoRepoInfo.innerHTML += '</label>';
				demoRepoInfo.innerHTML += '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="menosEstrelas">';
				demoRepoInfo.innerHTML += '<input type="radio" name="estrelas" id="menosEstrelas" class="mdl-radio__button" value="false">';
				demoRepoInfo.innerHTML += '<span class="mdl-radio__label">Menos Estrelas</span>';
				demoRepoInfo.innerHTML += '</label>';

				const menosEstrelas = document.getElementById('menosEstrelas');
				const maisEstrelas = document.getElementById('maisEstrelas');

				menosEstrelas.onclick = function() {
					demoRepoInfo.innerHTML = '';
					getRepo(git, demoRepoInfo, false);
				};

				maisEstrelas.onclick = function() {
					demoRepoInfo.innerHTML = '';
					getRepo(git, demoRepoInfo, true);
				};

				if (checkMaisEstrelas) {
					maisEstrelas.checked = true;
					repos.sort((repo1, repo2) => repo1.stargazers_count < repo2.stargazers_count ? 1 : -1);
				} else {
					menosEstrelas.checked = true;
					repos.sort((repo1, repo2) => repo1.stargazers_count < repo2.stargazers_count ? -1 : 1);
				}

				repos.forEach(function (repo) {

					const mdlCard = document.createElement('div');
					const h4 = document.createElement('h4');

					h4.innerHTML = '<a href="' + repo.html_url + '" target="_blank">' + repo.name + '</a>';
					h4.innerHTML += '<i class="material-icons demo-color-yellow">star</i>'.repeat(repo.stargazers_count);
					mdlCard.appendChild(h4);

					mdlCard.innerHTML += 'Linguagem:' + (repo.language == null ? 'Linguagem não definida' : repo.language) + '</br></br>';
					mdlCard.innerHTML += (repo.description == null ? 'Descrição não definida' : repo.description);
					mdlCard.className = 'mdl-card__supporting-text mdl-shadow--4dp';

					demoRepoInfo.appendChild(mdlCard);
				});

			});
		}
	}
})();
