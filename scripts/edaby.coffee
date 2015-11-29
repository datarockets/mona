###
  Description:
    Ordering some food from eda.by to the office

  Configuration:
    CLIENT_NAME
    CLIENT_EMAIL
    CLIENT_PHONE
    CLIENT_ADDRESS

  Commands:
    mona закажи нам <data> - it makes a request with prepared params
    mona удали из заказа <data> - it will delete an item in the order
    mona отправь заказ - it sends order to the EDA.BY

  Author:
    Dzmitry Chyrta
###

URL = 'http://eda.by/api.php'
CLIENT_NAME = process.env.CLIENT_NAME
CLIENT_EMAIL = process.env.CLIENT_EMAIL
CLIENT_PHONE =  process.env.CLIENT_PHONE # In format '+375+(ХХ)+ХХХ-ХХ-ХХ'
CLIENT_ADDRESS = process.env.CLIENT_ADDRESS

module.exports = (robot) ->

  foodItems = []
  robot.brain.set('foodItem', foodItems)

  makeOrder = (response) ->
    robot.http(URL)
      .header('Accept', 'application/json')
      .query({
        act: 'confirmcode',
        mobile: CLIENT_PHONE
      })
      .get() (err, res, body) ->
        if body
          data = null
          try
            data = JSON.parse(body)
            sendOrder(data["code"], response)
          catch _error
            error = _error
            response.send 'Ran into an error parsing JSON :('
            return
        return

  sendOrder = (mobileCode, response) ->

    i = 0
    orders = ''
    while i < foodItems.length
      orders = orders + "&dish[#{i}][id]=" + foodItems[i]["id"] + "&dish[#{i}][count]=" + foodItems[i]["count"]
      i++

    robot.http(URL + "?act=order&name=#{CLIENT_NAME}&email=#{CLIENT_EMAIL}&code=#{mobileCode}&delivery=1" + orders)
      .header('Accept', 'application/json')
      .get() (err, res, body) ->
        if err
          return err
        if body
          data = JSON.parse(body)
          response.send "Заказала. Бон аппетит, пупсики. Отслеживайте статус по этой ссылке: " + data["link"]

  add = (response) ->

    foodItem = response.match[1]

    switch foodItem
      when 'пиццу деревенскую'
        foodItems.push { 'id': '1938', 'count': 1}
        break
      when 'пиццу студенческую'
        foodItems.push { 'id': '1447', 'count': 1}
        break
      when 'пиццу цезарь'
        foodItems.push { 'id': '1857', 'count': 1}
        break
      when 'пиццу жульен'
        foodItems.push { 'id': '1868', 'count': 1}
        break
      when 'пиццу гаражную'
        foodItems.push { 'id': '1415', 'count': 1}
        break
      when 'пиццу маргарита'
        foodItems.push { 'id': '268', 'count': 1}
        break
      when 'пиццу пепперони'
        foodItems.push { 'id': '1861', 'count': 1}
        break
      when 'пиццу барбекю'
        foodItems.push { 'id': '889', 'count': 1}
        break

    response.robot.brain.save()
    response.send "Ок, добавила #{foodItem} в заказ."

  deleteItem = (response) ->
      if isListNull(foodItems) = true
        reponse.send "Ваш заказ ведь пуст!"
        return

      foodItem = response.match[1]
      index = foodItems.indexOf foodItem
      foodItems.splice index, 1

  isListNull = (orderList) ->
    if orderList == null || orderList.length == 0
      true
    else
      false

  robot.respond /закажи нам (.+)/i, add
  robot.respond /отправь заказ/i, makeOrder
  robot.respond /удали из заказа (.+)/i, deleteItem
