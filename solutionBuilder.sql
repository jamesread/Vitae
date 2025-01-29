-- MySQL dump 10.14  Distrib 5.5.33a-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: solutionBuilder
-- ------------------------------------------------------
-- Server version	5.5.33a-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'rhelonlyapp'),(2,'app'),(3,'win'),(4,'hypervisor'),(5,'os');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `container_members`
--

DROP TABLE IF EXISTS `container_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `container_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `container` int(11) DEFAULT NULL,
  `object` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `container_members`
--

LOCK TABLES `container_members` WRITE;
/*!40000 ALTER TABLE `container_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `container_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `containers`
--

DROP TABLE IF EXISTS `containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `containers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `containers`
--

LOCK TABLES `containers` WRITE;
/*!40000 ALTER TABLE `containers` DISABLE KEYS */;
/*!40000 ALTER TABLE `containers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_providers`
--

DROP TABLE IF EXISTS `object_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_providers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object` int(11) DEFAULT NULL,
  `class` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_providers`
--

LOCK TABLES `object_providers` WRITE;
/*!40000 ALTER TABLE `object_providers` DISABLE KEYS */;
INSERT INTO `object_providers` VALUES (5,1,1),(7,6,5),(8,6,5),(9,1,2),(10,3,2);
/*!40000 ALTER TABLE `object_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_types`
--

DROP TABLE IF EXISTS `object_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object` int(11) DEFAULT NULL,
  `class` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class` (`class`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_types`
--

LOCK TABLES `object_types` WRITE;
/*!40000 ALTER TABLE `object_types` DISABLE KEYS */;
INSERT INTO `object_types` VALUES (28,11,1),(4,1,4),(5,6,4),(6,12,4),(7,7,4),(8,1,5),(9,2,5),(10,3,5),(11,4,5),(12,5,5),(13,9,2),(27,5,4),(15,13,NULL),(16,13,NULL),(17,13,NULL),(18,13,NULL),(19,13,NULL),(20,13,NULL),(21,3,4),(22,15,2),(23,14,2),(26,13,2),(29,10,1),(30,8,4);
/*!40000 ALTER TABLE `object_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) DEFAULT NULL,
  `fullTitle` varchar(64) DEFAULT NULL,
  `description` varchar(64) DEFAULT NULL,
  `icon` varchar(256) DEFAULT NULL,
  `keywords` longtext,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objects`
--

LOCK TABLES `objects` WRITE;
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
INSERT INTO `objects` VALUES (1,'RHEL','Red Hat Enterprise Linux',NULL,'redhat.png','red hat redhat os system hypervisor'),(2,'Oracle Linux',NULL,NULL,'oracle.png','oracle os system'),(3,'Windows','Microsoft Windows',NULL,'windows.png','microsoft os system'),(4,'Mac OSX',NULL,'','mac.png','apple os system'),(5,'FreeBSD',NULL,'','freebsd.png','bsd'),(6,'RHEV','Red Hat Enterprise Virtualisation','Red Hat Enteprise Virtualisation','redhat.png','red hat redhat system hypervisor'),(7,'OpenStack',NULL,'','openstack.png','red hat redhat system hypervisor'),(8,'Hyper-V',NULL,'','windows.png','microsoft system hypervisor'),(9,'Oracle DB',NULL,'','oracle.png','oracle app'),(10,'HA','High Availability','HIgh Availability is a RHEL addon to do application clustering.','redhat.png','red hat redhat addon'),(11,'RS','Resilient Storage','Resilient Storage is a RHEL addon to do clustered file systems. ','redhat.png','red hat redhat addon'),(12,'ESXi','VMWare ESXi','A Hypervisor','vmware.png','hypervisor system'),(13,'HTTPD','Apache HTTPD',NULL,'apache.png','app'),(14,'JBoss EAP','JBoss Enterprise Application Platform','JBoss Enterprise Application Platform (EAP) is a large enterpris','jboss.png','jboss red hat redhat'),(15,'JBoss EWS','JBoss Enterprise Web Server','JBoss Enterprise Web Server (EWS) is a small, lightweight Java a','jboss.png','');
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-01-03 12:33:15
