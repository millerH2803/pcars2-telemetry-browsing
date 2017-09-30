package com.github.nabezokodaikon

import akka.actor.ActorSystem
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{ ContentTypes, HttpEntity }
import akka.http.scaladsl.server.{ HttpApp, Route }
import com.github.nabezokodaikon.util.FileUtil
import com.typesafe.scalalogging.LazyLogging
import spray.json.DefaultJsonProtocol

final case class User(userName: String, userAge: Int)
final case class Group(groupName: String)
final case class Info(user: User, group: Group)

trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val userFormat = jsonFormat2(User)
  implicit val groupFormat = jsonFormat1(Group)
  implicit val infoFormat = jsonFormat2(Info)
}

object WebServer extends HttpApp with JsonSupport {

  val contentDirectory = {
    val current = FileUtil.getCurrentDirectory
    s"$current/contents"
  }

  override def routes: Route = {
    pathSingleSlash {
      get {
        val file = s"${contentDirectory}/index.html"
        val contentType = FileUtil.getContentType(file)
        val text = FileUtil.readText(file)
        complete(HttpEntity(contentType, text))
      }
    } ~
      path("api") {
        post {
          extractClientIP { ip =>
            println("Client's ip is " + ip.toOption.map(_.getHostAddress).getOrElse("unknown"))
            val info = Info(
              User("Taro", 36),
              Group("Response"))
            complete(info)
          }
        }
      } ~
      path(Segments) { x: List[String] =>
        get {
          val segments = x.mkString("/")
          val file = s"${contentDirectory}/${segments}"
          val contentType = FileUtil.getContentType(file)
          val text = FileUtil.readText(file)
          complete(HttpEntity(contentType, text))
        }
      }
  }
}

object HttpExample extends App with LazyLogging {

  def helloWorld(name: String): String = {
    "Hello " + name + "!"
  }

  logger.info(helloWorld("Http"))

  val system = ActorSystem("webserver")
  WebServer.startServer("192.168.1.18", 9000, system)
  system.terminate
}