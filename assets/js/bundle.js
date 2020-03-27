(() => {
    const selector = selector => document.querySelector(selector);
    const create = element => document.createElement(element);

    const app = selector('#app');

    const Login = create('div');
    Login.classList.add('login');
    Login.id = 'login';

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
        e.preventDefault();

        const formData = [
            selector('#email'),
            selector('#password')
        ];
        const [email, password] = formData;

            const { url } = await fakeAuthenticate(email.value, password.value);
            location.href = '#users';
            const users = await getDevelopersList(url);
            renderPageUsers(users);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        (!email.validity.valid || !email.value || password.value.length <= 5)
            ? button.setAttribute('disabled', 'disabled')
            : button.removeAttribute('disabled');
    };

    Form.innerHTML = `
        <input type="email" id="email" name="email" placeholder="Entre com seu e-mail" title="Entre com seu e-mail" required>
        <input type="password" id="password" name="password" placeholder="Digite sua senha supersecreta" title="Digite sua senha supersecreta" required>
        <input type="submit" id="login-button" title="Entrar" value="Entrar">
    `;

    app.appendChild(Logo);
    app.appendChild(Login);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {
        const data = await fetch('https://www.mocky.io/v2/5dba690e3000008c00028eb6').then(result => result.json());

        const fakeJwtToken = `${btoa(email + password)}.${btoa(data.url)}.${(new Date()).getTime() + 300000}`;
        localStorage.setItem('token', fakeJwtToken);

        return data;
    }

    async function getDevelopersList(url) {
        const users = await fetch(url).then(result => result.json());
        return users;
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = 'none';

        const Ul = create('ul');
        Ul.classList.add('container');
        Ul.id = 'users';

        users.forEach(element => {
            const Li = create('li');
            Li.innerHTML = '<a href="'+ element.html_url +'" target="_blank" title="'+ element.login +'"><img src="'+ element.avatar_url +'" alt="'+ element.login +'"><p>'+ element.login +'</p></a>';
            Ul.appendChild(Li);
        });

        app.appendChild(Ul);
    }

    // init
    (async function () {
        const rawToken = localStorage.getItem('token');
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href = '#login';
            app.appendChild(Login);
            Login.style.display = 'block';
        } else {
            location.href = '#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()