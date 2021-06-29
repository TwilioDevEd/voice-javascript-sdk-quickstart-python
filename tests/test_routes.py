from unittest.mock import patch


def test_index(app, client):
    res = client.get('/')
    assert res.status_code == 200
    assert 'Make a Call' in res.get_data(as_text=True)


def test_voice_has_to_parameter(app, client):
    res = client.post('/voice', data=dict(phone='+593XXXXXXX'))
    assert res.status_code == 200
    assert '<Client>+593XXXXXXX</Client>' in res.get_data(as_text=True)


def test_voice_has_not_to_parameter(app, client):
    res = client.post('/voice')
    assert res.status_code == 200
    assert '<Say>Thanks for calling!</Say>' in res.get_data(as_text=True)


@patch('app.fake', **{'user_name.return_value': 'nezuko'})
def test_generate_token(app, client):
    res = client.get('/token')
    assert '"identity":"nezuko"' in res.get_data(as_text=True)
    assert '"token"' in res.get_data(as_text=True)
